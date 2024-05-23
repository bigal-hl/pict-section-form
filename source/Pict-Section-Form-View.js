const libPictViewClass = require('pict-view');

const libInformary = require('informary');

const libFormsTemplateProvider = require('./Pict-Section-Form-Provider-Templates.js');

class PictSectionForm extends libPictViewClass
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, require('./Pict-Section-Form-View-DefaultConfiguration.json'), pOptions);

		if (!tmpOptions.Manifests)
		{
			throw new Error('PictSectionForm instantiation attempt without a Manifests in pOptions.Manifest -- cannot instantiate.');
			return;
		}
		if (!tmpOptions.Manifests.hasOwnProperty('Section'))
		{
			throw new Error('PictSectionForm instantiation attempt without a Section manifest in pOptions.Manifests -- cannot instantiate.');
			return;
		}

		// Set the default destination address to be based on the section hash if it hasn't been overridden by the manifest section definition
		if (tmpOptions.DefaultDestinationAddress == '#Pict-Form-Container')
		{
			tmpOptions.DefaultDestinationAddress = `#Pict-Form-Container-${tmpOptions.Hash}`;
		}

		if (tmpOptions.DefaultRenderable == 'Form-Main')
		{
			tmpOptions.DefaultRenderable = `Form-${tmpOptions.Hash}`;
		}

		if (!tmpOptions.SectionTemplateHash)
		{
			tmpOptions.SectionTemplateHash = `Pict-Form-Template-${tmpOptions.Hash}`;
		}

		if (tmpOptions.Renderables.length < 1)
		{
			tmpOptions.Renderables.push(
				{
					RenderableHash: tmpOptions.DefaultRenderable,
					TemplateHash: tmpOptions.SectionTemplateHash,
					// one of append, prepend, replace or append_once
					RenderMethod: 'replace'
				});
		}

		super(pFable, tmpOptions, pServiceHash);

		// Pull in the section definition
		this.sectionDefinition = this.options;
	
		// Initialize the section manifest -- instantiated to live only the lifecycle of this view
		this.sectionManifest = this.fable.instantiateServiceProviderWithoutRegistration('Manifest', this.options.Manifests.Section);

		if (!this.pict.providers.PictFormSectionDefaultTemplateProvider)
		{
			let tmpDefaultTemplateProvider = this.pict.addProvider('PictFormSectionDefaultTemplateProvider', libFormsTemplateProvider.default_configuration, libFormsTemplateProvider);
			tmpDefaultTemplateProvider.initialize();
		}

		// Load any form-specific templates
		this.formsTemplateSetPrefix = `PFT-${this.Hash}-${this.UUID}`;
		if (this.options.hasOwnProperty('MetaTemplates') && Array.isArray(this.options.MetaTemplates))
		{
			for (let i = 0; i < this.options.MetaTemplates.length; i++)
			{
				let tmpMetaTemplate = this.options.MetaTemplates[i];

				if (tmpMetaTemplate.hasOwnProperty('HashPostfix') && tmpMetaTemplate.hasOwnProperty('Template'))
				{
					let tmpTemplateHash = `${this.formsTemplateSetPrefix}${tmpMetaTemplate.HashPostfix}`;
					this.pict.TemplateProvider.addTemplate(tmpTemplateHash, tmpMetaTemplate.Template);
				}
				else
				{
					this.log.warn(`MetaTemplate entry ${i} in PictSectionForm [${this.UUID}]::[${this.Hash}] does not have a Hash and Template property; custom template skipped.`);
				}
			}
		}

		this.formID = `Pict-Form-${this.Hash}-${this.UUID}`;

		this.informary = new libInformary({ Form:this.formID })

		this.initializeFormGroups();
	}

	onMarshalToView()
	{
		try
		{
			this.informary.marshalDataToForm(this.AppData,
				function(pError)
				{
					if (pError)
					{
						this.log.error(`Error marshaling data from view: ${pError}`);
					}
				});
		}
		catch (pError)
		{
			this.log.error(`Gross error marshaling data from view: ${pError}`);
		}
	}

	onMarshalFromView()
	{
		try
		{
			this.informary.marshalFormToData(this.AppData,
				function(pError)
				{
					if (pError)
					{
						this.log.error(`Error marshaling data to view: ${pError}`);
					}
				});
		}
		catch (pError)
		{
			this.log.error(`Gross error marshaling data to view: ${pError}`);
		}
	}

	initializeFormGroups()
	{
		// Enumerate the manifest and make sure a group exists for each group in the section definition
		let tmpDescriptorKeys = Object.keys(this.options.Manifests.Section.Descriptors);
		for (let i = 0; i < tmpDescriptorKeys.length; i++)
		{
			let tmpDescriptor = this.options.Manifests.Section.Descriptors[tmpDescriptorKeys[i]];

			if (
					// If there is an obect in the descriptor
					typeof(tmpDescriptor) == 'object' &&
					// AND it has a PictForm property
					tmpDescriptor.hasOwnProperty('PictForm') &&
					// AND the PictForm property is an object
					typeof(tmpDescriptor.PictForm) == 'object' &&
					// AND the PictForm object has a Section property
					tmpDescriptor.PictForm.hasOwnProperty('Section') &&
					// AND the Section property matches our section hash
					tmpDescriptor.PictForm.Section == this.sectionDefinition.Hash
				)
			{
				tmpDescriptor.PictForm.InformaryDataAddress = tmpDescriptorKeys[i];

				let tmpGroupHash = (typeof(tmpDescriptor.PictForm.Group) == 'string') ? tmpDescriptor.PictForm.Group : 'Default';
				
				let tmpGroup = this.sectionDefinition.Groups.find((pGroup) => { return pGroup.Hash == tmpGroupHash; });

				if (!tmpGroup)
				{
					tmpGroup = { Hash: tmpGroupHash, Name: tmpGroupHash, Description: false, Rows: [] };
					this.sectionDefinition.Groups.push(tmpGroup);
				}
				else if (!Array.isArray(tmpGroup.Rows))
				{
					tmpGroup.Rows = [];
				}

				let tmpRowHash = (typeof(tmpDescriptor.PictForm.Row) == 'string') ? tmpDescriptor.PictForm.Row :
								(typeof(tmpDescriptor.PictForm.Row) == 'number') ? `Row_${tmpDescriptor.PictForm.Row.toString()}` :
								'Row_Default';

				tmpDescriptor.PictForm.RowHash = tmpRowHash;

				let tmpRow = tmpGroup.Rows.find((pRow) => { return pRow.Hash == tmpRowHash; });

				if (!tmpRow)
				{
					tmpRow = { Hash: tmpRowHash, Name: tmpRowHash, Inputs: [] };
					tmpGroup.Rows.push(tmpRow);
					tmpRow.Inputs.push(tmpDescriptor);
				}
				else
				{
					tmpRow.Inputs.push(tmpDescriptor);
				}
			}
		}
	}

	rebuildCustomTemplate()
	{
		let tmpTemplate = ``;
		let tmpFormTemplatePrefix = 'Pict-Forms-Basic';

		if (this.pict.views.PictFormMetacontroller)
		{
			if (this.pict.views.PictFormMetacontroller.hasOwnProperty('formTemplatePrefix'))
			{
				tmpFormTemplatePrefix = this.pict.views.PictFormMetacontroller.formTemplatePrefix;
			}
		}

		// Add the Form Prefix stuff
		tmpTemplate += `{~T:${tmpFormTemplatePrefix}-Template-Wrap-Prefix:Pict.views["${this.Hash}"].sectionDefinition~}`;
		tmpTemplate += `\n{~T:${tmpFormTemplatePrefix}-Template-Section-Prefix:Pict.views["${this.Hash}"].sectionDefinition~}`;

		for (let i = 0; i < this.sectionDefinition.Groups.length; i++)
		{
			let tmpGroup = this.sectionDefinition.Groups[i];

			tmpTemplate += `\n{~T:${tmpFormTemplatePrefix}-Template-Group-Prefix:Pict.views["${this.Hash}"].sectionDefinition.Groups[${i}]~}`;

			if (!Array.isArray(tmpGroup.Rows))
			{
				continue;
			}

			for (let j = 0; j < tmpGroup.Rows.length; j++)
			{
				tmpTemplate += `\n{~T:${tmpFormTemplatePrefix}-Template-Row-Prefix:Pict.views["${this.Hash}"].sectionDefinition.Groups[${i}]~}`;
				for (let k = 0; k < tmpGroup.Rows[j].Inputs.length; k++)
				{
					let tmpTemplateInputScope = '-Template-Input';

					// Check for view-specific control/datatype templates
					if (this.pict.TemplateProvider.getTemplate(`${this.formsTemplateSetPrefix}${tmpTemplateInputScope}-InputType-${tmpGroup.Rows[j].Inputs[k].PictForm.InputType}`))
					{
						tmpTemplateInputScope += `-InputType-${tmpGroup.Rows[j].Inputs[k].PictForm.InputType}`;
						tmpTemplate += `\n{~T:${this.formsTemplateSetPrefix}${tmpTemplateInputScope}:Pict.views["${this.Hash}"].sectionDefinition.Groups[${i}].Rows[${j}].Inputs[${k}]~}`;
					}
					else if (this.pict.TemplateProvider.getTemplate(`${this.formsTemplateSetPrefix}${tmpTemplateInputScope}-DataType-${tmpGroup.Rows[j].Inputs[k].DataType}`))
					{
						tmpTemplateInputScope += `-DataType-${tmpGroup.Rows[j].Inputs[k].DataType}`;
						tmpTemplate += `\n{~T:${this.formsTemplateSetPrefix}${tmpTemplateInputScope}:Pict.views["${this.Hash}"].sectionDefinition.Groups[${i}].Rows[${j}].Inputs[${k}]~}`;
					}

					// Check for theme-specific control/datatype templates
					else if (this.pict.TemplateProvider.getTemplate(`${tmpFormTemplatePrefix}${tmpTemplateInputScope}-InputType-${tmpGroup.Rows[j].Inputs[k].PictForm.InputType}`))
					{
						tmpTemplateInputScope += `-InputType-${tmpGroup.Rows[j].Inputs[k].PictForm.InputType}`;
						tmpTemplate += `\n{~T:${tmpFormTemplatePrefix}${tmpTemplateInputScope}:Pict.views["${this.Hash}"].sectionDefinition.Groups[${i}].Rows[${j}].Inputs[${k}]~}`;
					}
					else if (this.pict.TemplateProvider.getTemplate(`${tmpFormTemplatePrefix}${tmpTemplateInputScope}-DataType-${tmpGroup.Rows[j].Inputs[k].DataType}`))
					{
						tmpTemplateInputScope += `-DataType-${tmpGroup.Rows[j].Inputs[k].DataType}`;
						tmpTemplate += `\n{~T:${tmpFormTemplatePrefix}${tmpTemplateInputScope}:Pict.views["${this.Hash}"].sectionDefinition.Groups[${i}].Rows[${j}].Inputs[${k}]~}`;
					}

					// Fall back on the default control/datatype template
					else
					{
						tmpTemplate += `\n{~T:${tmpFormTemplatePrefix}${tmpTemplateInputScope}:Pict.views["${this.Hash}"].sectionDefinition.Groups[${i}].Rows[${j}].Inputs[${k}]~}`;
					}
				}
				tmpTemplate += `\n{~T:${tmpFormTemplatePrefix}-Template-Row-Postfix:Pict.views["${this.Hash}"].sectionDefinition.Groups[${i}]~}`;
			}
			tmpTemplate += `\n{~T:${tmpFormTemplatePrefix}-Template-Group-Postfix:Pict.views["${this.Hash}"].sectionDefinition.Groups[${i}]~}`;
		}

		tmpTemplate += `\n{~T:${tmpFormTemplatePrefix}-Template-Section-Postfix:Pict.views["${this.Hash}"].sectionDefinition~}`;
		tmpTemplate += `\n{~T:${tmpFormTemplatePrefix}-Template-Wrap-Postfix:Pict.views["${this.Hash}"].sectionDefinition~}`;

		this.pict.TemplateProvider.addTemplate(this.options.SectionTemplateHash, tmpTemplate);
	}

	get isPictSectionForm()
	{
		return true;
	}
}

module.exports = PictSectionForm;