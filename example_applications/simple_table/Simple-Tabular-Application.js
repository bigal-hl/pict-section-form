const libPictSectionForm = require('../../source/Pict-Section-Form.js');

module.exports = libPictSectionForm.PictFormApplication;

module.exports.default_configuration = libPictSectionForm.PictFormApplication.default_configuration;
module.exports.default_configuration.pict_configuration = (
	{
		"Product": "SimpleTable",

		"DefaultAppData": require('./FruitData.json'),

		"DefaultFormManifest":
		{
			"Scope": "SuperSimpleTabularForm",

			"Sections": [
				{
					"Hash": "FruitGrid",
					"Name": "Fruits of the World",
					"Groups": [
						{
							"Hash": "FruitGrid",
							"Name": "FruitGrid",

							"Layout": "Tabular",

							"RecordSetAddress": "FruitData.FruityVice",
							"RecordManifest": "FruitEditor"
						}
					]
				},
			],

			"Descriptors":
			{
				"FruitData.FruityVice":
				{
					"Name": "Fruits of the Earth",
					"Hash": "FruitGrid",
					"DataType": "Array",
					"Default": []
					, "PictForm": { "Section": "FruitGrid", "Group":"FruitGrid" }
				},
			},

			"ReferenceManifests":
			{
				"FruitEditor":
				{
					"Scope": "FruitEditor",
					"Descriptors":
					{
						"name":
						{
							"Name": "Fruit Name",
							"Hash": "Name",
							"DataType": "String",
							"Default": "(unnamed fruit)"
							, "PictForm": { "Section": "FruitGrid", "Group":"FruitGrid" }
						},
						"family":
						{
							"Name": "Family",
							"Hash": "Family",
							"DataType": "String"
							, "PictForm": { "Section": "FruitGrid", "Group":"FruitGrid" }
						},
						"order":
						{
							"Name": "Order",
							"Hash": "Order",
							"DataType": "String"
							, "PictForm": { "Section": "FruitGrid", "Group":"FruitGrid" }
						},
						"genus":
						{
							"Name": "Genus",
							"Hash": "Genus",
							"DataType": "String"
							, "PictForm": { "Section": "FruitGrid", "Group":"FruitGrid" }
						},
						"nutritions.calories":
						{
							"Name": "Calories",
							"Hash": "Calories",
							"DataType": "Number"
						}
					}
				}
			}
		}
	});