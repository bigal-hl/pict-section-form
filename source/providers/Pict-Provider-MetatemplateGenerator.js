const libPictProvider = require('pict-provider');

const _DefaultProviderConfiguration = (
{
	"ProviderIdentifier": "Pict-DynamicForms-Provider-MetatemplateGenerator",

	"AutoInitialize": true,
	"AutoInitializeOrdinal": 0,

	"AutoSolveWithApp": false
})

class PictMetatemplateGenerator extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(_DefaultProviderConfiguration)), pOptions);
		
		super(pFable, tmpOptions, pServiceHash);
	}

	getMetatemplateTemplateReferenceRaw(pView, pTemplatePostfix, pRawTemplateDataAddress)
	{
		// 1. Check if there is a section-specific template loaded
		if (pView.checkViewSpecificTemplate(pTemplatePostfix))
		{
			return `\n{~T:${pView.formsTemplateSetPrefix}${pTemplatePostfix}:${pRawTemplateDataAddress}~}`;
		}
		// 2. Check if there is a theme-specific template loaded for this postfix
		else if (pView.checkThemeSpecificTemplate(pTemplatePostfix))
		{
			return `\n{~T:${pView.defaultTemplatePrefix}${pTemplatePostfix}:${pRawTemplateDataAddress}~}`;
		}
		// 3. This shouldn't happen if the template is based on the base class.
		else
		{
			return false;
		}
	}

	getMetatemplateTemplateReference(pView, pTemplatePostfix, pViewDataAddress)
	{
		return this.getMetatemplateTemplateReferenceRaw(pView, pTemplatePostfix, `Pict.views["${pView.Hash}"].${pViewDataAddress}`);
	}

	checkMetatemplateReference(pView, pDataType, pInputType)
	{
		// Input types are customizable -- there could be 30 different input types for the string data type with special handling and templates
		let tmpTemplateInputTypePostfix = `-Template-Input-InputType-${pInputType}`;
		// Data types are not customizable; they are a fixed list based on what is available in Manyfest
		let tmpTemplateDataTypePostfix = `-Template-Input-DataType-${pDataType}`;

		// 1. Check if there is a section-specific template loaded
		if (pView.checkViewSpecificTemplate(tmpTemplateInputTypePostfix))
		{
			return `\n{~T:${pView.formsTemplateSetPrefix}${pTemplatePostfix}:${pRawTemplateDataAddress}~}`;
		}
		// 2. Check if there is a theme-specific template loaded for this postfix
		else if (pView.checkThemeSpecificTemplate(pTemplatePostfix))
		{
			return `\n{~T:${pView.defaultTemplatePrefix}${pTemplatePostfix}:${pRawTemplateDataAddress}~}`;
		}
		// 3. This shouldn't happen if the template is based on the base class.
		else
		{
			return false;
		}
	}

	getInputMetatemplateTemplateReference(pView, pDataType, pInputType, pViewDataAddress)
	{
		// Input types are customizable -- there could be 30 different input types for the string data type with special handling and templates
		let tmpTemplateInputTypePostfix = `-Template-Input-InputType-${pInputType}`;
		// Data types are not customizable; they are a fixed list based on what is available in Manyfest
		let tmpTemplateDataTypePostfix = `-Template-Input-DataType-${pDataType}`;

		// First check if there is an "input type" template available in either the section-specific configuration or in the general
		if (pInputType)
		{
			let tmpTemplate = this.getMetatemplateTemplateReference(pView, tmpTemplateInputTypePostfix, pViewDataAddress);
			if (tmpTemplate)
			{
				return tmpTemplate;
			}
		}

		// If we didn't find the template for the "input type", check for the "data type"
		let tmpTemplate = this.getMetatemplateTemplateReference(pView, tmpTemplateDataTypePostfix, pViewDataAddress);
		if (tmpTemplate)
		{
			return tmpTemplate;
		}
	
		// There wasn't an input type specific or data type specific template, so fall back to the generic input template.
		return this.getMetatemplateTemplateReference(pView, '-Template-Input', pViewDataAddress);
	}

	getTabularInputMetatemplateTemplateReference(pView, pDataType, pInputType, pViewDataAddress, pGroupIndex, pRowIndex)
	{
		// Input types are customizable -- there could be 30 different input types for the string data type with special handling and templates
		let tmpTemplateBeginInputTypePostfix = `-TabularTemplate-Begin-Input-InputType-${pInputType}`;
		let tmpTemplateMidInputTypePostfix = `-TabularTemplate-Mid-Input-InputType-${pInputType}`;
		let tmpTemplateEndInputTypePostfix = `-TabularTemplate-End-Input-InputType-${pInputType}`;
		// Data types are not customizable; they are a fixed list based on what is available in Manyfest
		let tmpTemplateBeginDataTypePostfix = `-TabularTemplate-Begin-Input-DataType-${pDataType}`;
		let tmpTemplateMidDataTypePostfix = `-TabularTemplate-Mid-Input-DataType-${pDataType}`;
		let tmpTemplateEndDataTypePostfix = `-TabularTemplate-End-Input-DataType-${pDataType}`;

		// Tabular inputs are done in three parts -- the "begin", the "address" of the data and the "end".

		// This means it is easily extensible to work on JSON objects as well as arrays.
		let tmpMidTemplate = this.getMetatemplateTemplateReference(pView, '-TabularTemplate-Mid-Input', pViewDataAddress, pGroupIndex, pRowIndex);
		let tmpInformaryDataAddressTemplate = this.getMetatemplateTemplateReference(pView, '-TabularTemplate-InformaryAddress-Input', pViewDataAddress, pGroupIndex, pRowIndex);

		// First check if there is an "input type" template available in either the section-specific configuration or in the general
		if (pInputType)
		{
			let tmpBeginTemplate = this.getMetatemplateTemplateReference(pView, tmpTemplateBeginInputTypePostfix, pViewDataAddress);
			let tmpEndTemplate = this.getMetatemplateTemplateReference(pView, tmpTemplateEndInputTypePostfix, pViewDataAddress);
			let tmpCustomMidTemplate = this.getMetatemplateTemplateReference(pView, tmpTemplateMidInputTypePostfix, pViewDataAddress, pGroupIndex, pRowIndex);
			tmpMidTemplate = (tmpCustomMidTemplate) ? tmpCustomMidTemplate : tmpMidTemplate;
			if (tmpBeginTemplate && tmpEndTemplate)
			{
				return tmpBeginTemplate + tmpMidTemplate + tmpInformaryDataAddressTemplate + tmpEndTemplate;
			}
		}

		// If we didn't find the template for the "input type", check for the "data type"
		let tmpBeginTemplate = this.getMetatemplateTemplateReference(pView, tmpTemplateBeginDataTypePostfix, pViewDataAddress);
		let tmpEndTemplate = this.getMetatemplateTemplateReference(pView, tmpTemplateEndDataTypePostfix, pViewDataAddress);
		if (tmpBeginTemplate && tmpEndTemplate)
		{
			let tmpCustomMidTemplate = this.getMetatemplateTemplateReference(pView, tmpTemplateMidDataTypePostfix, pViewDataAddress, pGroupIndex, pRowIndex);
			tmpMidTemplate = (tmpCustomMidTemplate) ? tmpCustomMidTemplate : tmpMidTemplate;
			return tmpBeginTemplate + tmpMidTemplate + tmpInformaryDataAddressTemplate + tmpEndTemplate;
		}
	


		// If we didn't find the template for the "input type", or the "data type", fall back to the default
		tmpBeginTemplate = this.getMetatemplateTemplateReference(pView, 'TabularTemplate-Begin-Input', pViewDataAddress);
		tmpEndTemplate = this.getMetatemplateTemplateReference(pView, 'TabularTemplate-End-Input', pViewDataAddress);
		if (tmpBeginTemplate && tmpEndTemplate)
		{
			return tmpBeginTemplate + tmpMidTemplate + tmpInformaryDataAddressTemplate + tmpEndTemplate;
		}
	
		// There was some kind of catastrophic failure -- the above templates should always be loaded.
		this.log.error(`PICT Form [${pView.UUID}]::[${pView.Hash}] catastrophic error generating tabular metatemplate: missing input template for Data Type ${pDataType} and Input Type ${pInputType}, Data Address ${pViewDataAddress}, Group Index ${pGroupIndex} and Record Subaddress ${pRowIndex}.`)
		return '';
	}

	getGroupLayoutProvider(pView, pGroup)
	{
		let tmpGroupLayout = (typeof(pGroup.Layout) === 'string') ? pGroup.Layout :
								(typeof(pView.sectionDefinition.DefaultGroupLayout) === 'string') ? pView.sectionDefinition.DefaultGroupLayout :
								'Record';
		// This switch is unnecessary but meant to be illustrative of what this function does.
		// It could technically be as simple as the default stanza.
		switch(tmpGroupLayout)
		{
			case 'Tabular':
				return this.pict.providers['Pict-Layout-Tabular'];
			case 'Record':
				return this.pict.providers['Pict-Layout-Record'];
			default:
				// Try to load a custom layout, then fall back to the Record layout if it doesn't exist
				if (`Pict-Layout-${tmpGroupLayout}` in this.pict.providers)
				{
					return this.pict.providers[`Pict-Layout-${tmpGroupLayout}`];
				}
				else
				{
					return this.pict.providers['Pict-Layout-Record'];
				}
		}
	}

	rebuildCustomTemplate(pView)
	{
		let tmpTemplate = ``;

		if (this.pict.views.PictFormMetacontroller && ('formTemplatePrefix' in this.pict.views.PictFormMetacontroller) && (!('defaultTemplatePrefix' in pView)))
		{
				pView.defaultTemplatePrefix = this.pict.views.PictFormMetacontroller.formTemplatePrefix;
		}

		tmpTemplate += this.getMetatemplateTemplateReference(pView, `-Template-Wrap-Prefix`, `sectionDefinition`);
		tmpTemplate += this.getMetatemplateTemplateReference(pView, `-Template-Section-Prefix`, `sectionDefinition`);

		for (let i = 0; i < pView.sectionDefinition.Groups.length; i++)
		{
			let tmpGroup = pView.sectionDefinition.Groups[i];

			// Add pView to the group object for metatemplating
			tmpGroup.GroupIndex = i;
			tmpGroup.SectionTabularRowVirtualTemplateHash = `Pict-Form-Template-TabularRow-Virtual-${pView.options.Hash}-G${tmpGroup.GroupIndex}`;
			tmpGroup.SectionTabularRowTemplateHash = `Pict-Form-Template-TabularRow-${pView.options.Hash}-G${tmpGroup.GroupIndex}`;

			tmpTemplate += this.getGroupLayoutProvider(pView, tmpGroup).generateGroupLayoutTemplate(pView, tmpGroup);
		}

		tmpTemplate += this.getMetatemplateTemplateReference(pView, `-Template-Section-Postfix`, `sectionDefinition`);
		tmpTemplate += this.getMetatemplateTemplateReference(pView, `-Template-Wrap-Postfix`, `sectionDefinition`);

		this.pict.providers.MetatemplateMacros.rebuildMacros(pView);

		this.pict.TemplateProvider.addTemplate(pView.options.SectionTemplateHash, tmpTemplate);
	}
}

module.exports = PictMetatemplateGenerator;
module.exports.default_configuration = _DefaultProviderConfiguration;
