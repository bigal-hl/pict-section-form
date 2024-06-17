const libPictViewClass = require('pict-view');

const libFormsTemplateProvider = require('./Pict-Section-Form-Provider-Templates.js');

// "What dependency injection in javascript?"
//  -- Ned

class PictFormMetacontroller extends libPictViewClass
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.serviceType = 'PictFormMetacontroller';

		if (!this.pict.providers.PictFormSectionDefaultTemplateProvider)
		{
			let tmpDefaultTemplateProvider = this.pict.addProvider('PictFormSectionDefaultTemplateProvider', libFormsTemplateProvider.default_configuration, libFormsTemplateProvider);
			tmpDefaultTemplateProvider.initialize();
			this.pict.addTemplate(require(`./Pict-Template-MetacontrollerValueSetWithGroup.js`));
		}

		this.viewMarshalDestination = 'AppData';

		this.formTemplatePrefix = 'Pict-Forms-Basic';
	}

	onMarshalFromView()
	{
		let tmpViewList = Object.keys(this.fable.views);
		for (let i = 0; i < tmpViewList.length; i++)
		{
			if (this.fable.views[tmpViewList[i]].isPictSectionForm)
			{
				this.fable.views[tmpViewList[i]].marshalFromView();
			}
		}
		return super.onMarshalFromView();
	}

	onMarshalToView()
	{
		let tmpViewList = Object.keys(this.fable.views);
		for (let i = 0; i < tmpViewList.length; i++)
		{
			if (this.fable.views[tmpViewList[i]].isPictSectionForm)
			{
				this.fable.views[tmpViewList[i]].marshalToView();
			}
		}
		return super.onMarshalToView();
	}

	onAfterInitializeAsync(fCallback)
	{
		// This is safe -- if there is no settings.DefaultFormManifest configuration, it just doesn't do anything
		this.bootstrapPictFormViewsFromManifest();

		// Generate the metatemplate (the container for each section)
		this.generateMetatemplate();

		return super.onAfterInitializeAsync(fCallback);
	}

	onAfterRender()
	{
		if (this.options.AutoPopulateAfterRender)
		{
			this.regenerateFormSectionTemplates();
			this.renderFormSections();
//			this.solve();
			this.marshalToView();
		}

		return super.onAfterRender();
	}

	onSolve()
	{
		let tmpViewList = Object.keys(this.fable.views);
		for (let i = 0; i < tmpViewList.length; i++)
		{
			if (this.fable.views[tmpViewList[i]].isPictSectionForm)
			{
				this.fable.views[tmpViewList[i]].marshalFromView();
			}
		}
		return super.onSolve();
	}

	filterViews(fFilterFunction, fSortFunction)
	{
		let tmpViewList = Object.keys(this.fable.views);
		let tmpFilteredViewList = [];

		for (let i = 0; i < tmpViewList.length; i++)
		{
			if (fFilterFunction && !fFilterFunction(this.fable.views[tmpViewList[i]]))
			{
				continue;
			}
			// If this doesn't only render dynamic sections, it will load
			if (!this.options.OnlyRenderDynamicSections || this.fable.views[tmpViewList[i]].isPictSectionForm)
			{
				tmpFilteredViewList.push(this.fable.views[tmpViewList[i]]);
			}
		}

		// This is to allow dynamic forms sections to have their own sorting criteria
		if (typeof(fSortFunction) == 'function')
		{
			tmpFilteredViewList.sort(fSortFunction);
		}

		return tmpFilteredViewList;
	}

	renderSpecificFormSection(pFormSectionHash)
	{
		let fViewFilter = (pView) => { return pView.Hash == pFormSectionHash; };
		this.generateMetatemplate(fViewFilter);
		this.render();
	}

	renderFormSections(fFilterFunction, fSortFunction)
	{
		let tmpViewList = this.filterViews(fFilterFunction, fSortFunction);
		for (let i = 0; i < tmpViewList.length; i++)
		{
			tmpViewList[i].render();
		}
	}

	regenerateFormSectionTemplates(fFormSectionFilter, fSortFunction)
	{
		let tmpViewList = this.filterViews(fFormSectionFilter, fSortFunction);
		for (let i = 0; i < tmpViewList.length; i++)
		{
			tmpViewList[i].rebuildCustomTemplate();
		}
		// Make sure any form-specific CSS is injected properly.
		this.pict.CSSMap.injectCSS();
	}

	generateMetatemplate(fFormSectionFilter, fSortFunction)
	{
		let tmpTemplate = ``;

		if (!this.formTemplatePrefix)
		{
			this.formTemplatePrefix = 'Pict-Forms-Basic';
		}

		// Add the Form Prefix stuff
		tmpTemplate += `{~T:${this.formTemplatePrefix}-Template-Form-Container-Header:Pict.views["${this.Hash}"]~}`;

		let tmpViewList = this.filterViews(fFormSectionFilter, fSortFunction);

		for (let i = 0; i < tmpViewList.length; i++)
		{
			let tmpFormView = tmpViewList[i];
			tmpTemplate += `\n{~T:${this.formTemplatePrefix}-Template-Form-Container-Wrap-Prefix:Pict.views["${tmpFormView.Hash}"]~}`;
			tmpTemplate += `\n{~T:${this.formTemplatePrefix}-Template-Form-Container:Pict.views["${tmpFormView.Hash}"]~}`;
			tmpTemplate += `\n{~T:${this.formTemplatePrefix}-Template-Form-Container-Wrap-Postfix:Pict.views["${tmpFormView.Hash}"]~}`;
		}
		tmpTemplate += `{~T:${this.formTemplatePrefix}-Template-Form-Container-Footer:Pict.views["${this.Hash}"]~}`;

		this.pict.TemplateProvider.addTemplate(this.options.MetaTemplateHash, tmpTemplate);
	}

	getSectionDefinition(pSectionObject)
	{
		if (typeof(pSectionObject) != 'object')
		{
			this.log.error('getSectionDefinition() called without a valid section object.');
			return false;
		}

		if (!('Hash' in pSectionObject))
		{
			this.log.error('getSectionDefinition() called without a valid section object hash.');
			return false;
		}

		try
		{
			let tmpSectionDefinition = JSON.parse(JSON.stringify(pSectionObject));

			if (!('Name' in tmpSectionDefinition))
			{
				// If there isn't a name, use the hash
				tmpSectionDefinition.Name = tmpSectionDefinition.Hash;
			}
			if (!('Description' in tmpSectionDefinition))
			{
				// If there isn't a description, use the name
				tmpSectionDefinition.Description = `PICT Section [${tmpSectionDefinition.Name}].`;
			}
			if (!('Groups' in tmpSectionDefinition))
			{
				// If there isn't a groups array, create an empty one
				tmpSectionDefinition.Groups = [];
			}

			return tmpSectionDefinition;
		}
		catch(pError)
		{
			this.log.error('getSectionDefinition() failed to parse the section object.');
			return false;
		}
	}

	bootstrapPictFormViewsFromManifest(pManifestDescription)
	{
		let tmpManifestDescription = (typeof(pManifestDescription) === 'object') ? pManifestDescription : false;
		let tmpSectionList = [];

		if (typeof(tmpManifestDescription) != 'object')
		{
			// Check and see if there is a DefaultFormManifest in the settings
			if (('DefaultFormManifest' in this.fable.settings)
				&& typeof(this.fable.settings.DefaultFormManifest) == 'object'
				&& ('Descriptors' in this.fable.settings.DefaultFormManifest))
			{
				tmpManifestDescription = this.fable.settings.DefaultFormManifest;
			}
			else
			{
				this.log.error('PictFormMetacontroller.bootstrapPictFormViewsFromManifest() called without a valid manifest, and no settings.DefaultFormManifest was provided.');
				return tmpSectionList;
			}
		}

		let tmpManifest = this.fable.instantiateServiceProviderWithoutRegistration('Manifest', tmpManifestDescription);

		if (this.options.AutoPopulateDefaultObject)
		{
			// Fill out the defaults at the marshal location if it doesn't exist
			let tmpMarshalDestinationObject = tmpManifest.getValueAtAddress(this, this.viewMarshalDestination);
			if (typeof(tmpMarshalDestinationObject) === 'object')
			{
				tmpManifest.populateDefaults(tmpMarshalDestinationObject);
			}
		}

		// Get the list of Explicitly Defined section hashes from the Sections property of the manifest
		if (('Sections' in tmpManifestDescription) && Array.isArray(tmpManifestDescription.Sections))
		{
			for (let i = 0; i < tmpManifestDescription.Sections.length; i++)
			{
				let tmpSectionDefinition = this.getSectionDefinition(tmpManifestDescription.Sections[i]);

				if (tmpSectionDefinition)
				{
					tmpSectionList.push(tmpSectionDefinition);
				}
			}
		}

		let tmpImplicitSectionHashes = {};

		let tmpDescriptorKeys = Object.keys(tmpManifest.elementDescriptors);

		for (let i = 0; i < tmpDescriptorKeys.length; i++)
		{
			let tmpDescriptor = tmpManifest.elementDescriptors[tmpDescriptorKeys[i]];

			if (
					// If there is an object in the descriptor
					typeof(tmpDescriptor) == 'object' &&
					// AND it has a PictForm property
					('PictForm' in tmpDescriptor) &&
					// AND the PictForm property is an object
					typeof(tmpDescriptor.PictForm) == 'object' &&
					// AND the PictForm object has a Section property
					('Section' in tmpDescriptor.PictForm) && 
					// AND the Section property is a string
					typeof(tmpDescriptor.PictForm.Section) == 'string'
				)
			{
				tmpImplicitSectionHashes[tmpDescriptor.PictForm.Section] = true;
			}
		}

		let tmpImplicitSectionKeys = Object.keys(tmpImplicitSectionHashes);

		for (let i = 0; i < tmpImplicitSectionKeys.length; i++)
		{
			let tmpExistingSection = tmpSectionList.find((pSection) => { return pSection.Hash == tmpImplicitSectionKeys[i]; });

			if (!tmpExistingSection)
			{
				tmpSectionList.push(this.getSectionDefinition({Hash: tmpImplicitSectionKeys[i]}));
			}
		}

		// Now load a section view for each section
		for (let i = 0; i < tmpSectionList.length; i++)
		{
			let tmpViewHash = `PictSectionForm-${tmpSectionList[i].Hash}`;

			if (tmpViewHash in this.fable.views)
			{
				this.log.info(`getSectionList() found an existing view for section [${tmpSectionList[i].Hash}] so will be skipped.`);
				continue;
			}
			let tmpViewConfiguration = JSON.parse(JSON.stringify(tmpSectionList[i]));
			if (!('Manifests' in tmpViewConfiguration))
			{
				tmpViewConfiguration.Manifests = {};
			}
			tmpViewConfiguration.Manifests.Section = tmpManifestDescription;
			tmpViewConfiguration.AutoMarshalDataOnSolve = this.options.AutoMarshalDataOnSolve;
			this.fable.addView(tmpViewHash, tmpViewConfiguration, require('./Pict-Section-Form-View.js'));
		}

		return tmpSectionList;
	}
}

module.exports = PictFormMetacontroller;
module.exports.default_configuration = (
{
	"AutoRender": true,

	"AutoPopulateDefaultObject": true,
	"AutoSolveBeforeRender": true,
	"AutoPopulateAfterRender": true,

	"DefaultRenderable": "Pict-Forms-Metacontainer",
	"DefaultDestinationAddress": "#Pict-Form-Container",

	"AutoMarshalDataOnSolve": true,
	"OnlyRenderDynamicSections": true,

	"MetaTemplateHash": "Pict-Forms-Metatemplate",

	"Templates": [
		{
			"Hash": "Pict-Forms-Metatemplate",
			"Template": "<!-- Pict-Forms-Metatemplate HAS NOT BEEN GENERATED; call pict.views.PictFormsMetatemplate.generateMetatemplate() to build the containers -->"
		}
	],
	"Renderables": [
		{
			"RenderableHash": "Pict-Forms-Metacontainer",
			"TemplateHash": "Pict-Forms-Metatemplate",
			"DestinationAddress": "#Pict-Form-Container"
		}
	]
});
