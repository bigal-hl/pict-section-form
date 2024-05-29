# PICT Forms Section

A Form Section with programmatically definable content.  Simple, extensible 
function APIs for adding groups, rows, entry elements and documentation or
user workflow guidance.

Does not provide or have room for opinionation regarding UI Frameworks.

Does allow configuration-only management for layout, data marshaling and
mathematical solving.

## Vocabulary

1. Section:  
An instance of the view.  Has group(s).
2. Group:  
A cluster of inputs layed out by rows and widths.
3. Input:  
An entry element on the form.
4. Row:  
The suggested row (some identifier for it) for this control to reside on.
4. Width:  
How wide we want the input in a row.  Can be any of literal, relative or quantized (e.g. it might take the literal numbers and try to cast them into sets of 12 for a 12 column layout css style set like bootstrap).
5. Name:  
The label on an input, group or section.
6. Hash:  
The human-readable identifier on an input.  Expected to be unique although the default templates will prefix this with a distinct view identifier.
7. Tip:  
A tooltip, hover or other kinds of embedded content/help on an input element.
8. Macro:  
A small bit of template that's preprocessed and usable by the template partials.


## Example Application: Sentimental Postcard Deluxe Dot Com

Let's say we had an idea for a sentiment-based web application that collected a bit of information about a postcard, and, an address to mail it to the person so they felt special.

We might collect the following sets of information:

Their name, a date to send it to them, some kind of title for the postcard and a heartfelt message.  Additionally we would want to get a signature line of the sender!

Also, we would want their street address to mail it to.

Lastly, we would collect an email address or phone number for the sender to message when the postcard was shipped.

### Breaking up the data

We could keep this as a single section, or, three discrete sections.  If it were a single section it may be useful to have multiple groups of inputs.

Our product team decided they want two sections, one with two groups about the postcard and a separate section collecting the delivery notifications and a checkbox to sign up for our kindness mailing list (tm).

### Sections

#### Section 1: Postcard

This section has two groups ... the first group, *Postcard Content*, has the following data elements:

* Recipient Name
* Send Date
* Message Title
* Heartfelt Message
* Signature Line

The second group, *Delivery Destination*, has the following data elements:

* Street Address 1
* Street Address 2
* City
* State
* Zip

#### Section 2: Delivery Confirmation

Sentimental as we are, this is still a business.  Our business model is simple: send out free post cards and harvest those sweet, sweet email address and phone numbers from senders.  This section only has one group and it does not have a name:

* Sender Email
* Sender Cell Phone
* Consent to Being on the Mailing List

### Our API Team Has Not Been Idle

There is also a data structure for these.  The API for a postcard gives and takes data in the following shape:

```json
{
	"PostcardContent":
	{
		"RecipientName": "Sam Smith",
		"SendDate": "2023-08-10T00:00:00.000Z",
		"MessageTitle": "Sometimes paths part...",
		"MessageBody": "It's been forever since we were in school together! Can we catch up?\nMy phone number hasn't changed.",
		"SignatureLine": "Captain Crunch"
	},
	"DeliveryDestination":
	{
		"StreetAddress1": "12345 6th Avenue South",
		"StreetAddress2": "Unit 1",
		"City": "Somewheresville",
		"State": "WA",
		"Zip": 98765
	},
	"SenderData":
	{
		"EmailAddress": "capncrunch@pequod.com",
		"PhoneNumber": "(123) 867-5309",
		"ExplicitConsentToMailers": true
	}
}
```

### The PICT Representation

Our application stores this record in `pict.AppData.FormData.Postcard`.  The reading and writing of this to our server is done through another application provider.  We expect this data to be present if a record is loaded, and for the intents of this demo if it is there we want to let the user edit it.

### A Manyfest for Every Section

Each section is represented within a manyfest.  You could have one manyfest for each section *or* the sections can each have their own.  Or mix and match?  Your choice.

```json
{
	"Scope": "Form-Section-Postcard",

	"Form-Section-Configuration":
		{
			"DefaultTemplatePrefix": "PictBasicForm-"
		},

	"Sections": [
			{
				"Name": "Postcard Information",
				"Hash": "Postcard",

				"Description": "The content and destination for the postcard you would like to send.",
				"Groups": [
					{
						"Name": "Content",
						"Hash": "Content",
						"Description": "The message and recipient of your postcard."
					},
					{
						"Name": "Delivery Destination",
						"Hash": "Destination",
						"Description": "The message and recipient of your postcard."
					}
				]
			},
			{
				"Name": "Delivery Confirmation Contact Info",
				"Hash": "Confirmation",
				"Description": "The email address and phone number of the sender.",
				"Groups": []
			}
		],

	"Descriptors":
		{
			"PostcardContent.RecipientName":
				{
					"Name":"Recipient Name",
					"Hash":"RecipientName",
					"Description":"The name of the recipient who you want to send your postcard to.",
					"DataType":"String"
					,"PictForm": { "Section":"Postcard", "Group":"Content", "Row":1, "Width":8 }
				},
			"PostcardContent.SendDate":
				{
					"Name":"Send Date",
					"Hash":"SendDate",
					"Description":"The date you would like the postcard sent.",
					"DataType":"DateTime"
					,"PictForm": { "Section":"Postcard", "Group":"Content", "Row":1, "Width":4 }
				},
			"PostcardContent.MessageTitle":
				{
					"Name":"Message Title",
					"Hash":"MessageTitle",
					"Description":"A bold and beautiful title for your message.",
					"DataType":"String"
					,"PictForm": { "Section":"Postcard", "Group":"Content", "Row":2, "Width":12 }
				},
			"PostcardContent.MessageBody":
				{
					"Name":"Heartfelt Message",
					"Hash":"MessageBody",
					"Description":"The message you want your sender to receive.",
					"DataType":"String"
					,"PictForm": { "Section":"Postcard", "Group":"Content", "Row":3, "Width":12, "InputType":"TextArea" }
				},
			"PostcardContent.SignatureLine": 
				{
					"Name":"Signature Line",
					"Hash":"SignatureLine",
					"Description":"How you would like your card signed.",
					"DataType":"String"
					,"PictForm": { "Section":"Postcard", "Group":"Content", "Row":4, "Width":12 }
				},
			"DeliveryDestination.StreetAddress1": 
				{
					"Name":"Street Address Line 1",
					"Hash":"StreetAddress1",
					"Description":"The street address for the recipient.",
					"DataType":"String"
					,"PictForm": { "Section":"Postcard", "Group":"Destination", "Row":1, "Width":12 }
				},
			"DeliveryDestination.StreetAddress2": 
				{
					"Name":"Street Address Line 2",
					"Hash":"StreetAddress2",
					"Description":"An additional line for the recipient's street address if necessary.",
					"DataType":"String"
					,"PictForm": { "Section":"Postcard", "Group":"Destination", "Row":2, "Width":12 }
				},
			"DeliveryDestination.City": 
				{
					"Name":"City",
					"Hash":"City",
					"Description":"The city where the recipient lives.",
					"DataType":"String"
					,"PictForm": { "Section":"Postcard", "Group":"Destination", "Row":3, "Width":6 }
				},
			"DeliveryDestination.State": 
				{
					"Name":"State",
					"Hash":"State",
					"Description":"The state where the recipient lives.",
					"DataType":"String"
					,"PictForm": { "Section":"Postcard", "Group":"Destination", "Row":1, "Width":2 }
				},
			"DeliveryDestination.Zip": 
				{
					"Name":"Zip Code",
					"Hash":"Zip",
					"Description":"The zip code (sans extra four digits) where the recipient resides.",
					"DataType":"Number"
					,"PictForm": { "Section":"Postcard", "Group":"Destination", "Row":1, "Width":4 }
				},
			"SenderData.EmailAddress": 
				{
					"Name":"Email Address",
					"Hash":"SenderEmailAddress",
					"Description":"The email address of the sender, for notification when the postcard is shipped.",
					"DataType":"String"
					,"PictForm": { "Section":"Confirmation", "Row":1, "Width":12 }
				},
			"SenderData.PhoneNumber": 
				{
					"Name":"Phone Number",
					"Hash":"SenderPhoneNumber",
					"Description":"The phone number where the sender can be texted, for notification when the postcard is shipped.",
					"DataType":"String"
					,"PictForm": { "Section":"Confirmation", "Row":2, "Width":10, "CSSClasses": ["VeryImportantData"] }
				},
			"SenderData.ExplicitConsentToMailers": 
				{
					"Name":"Marketing Consent",
					"Hash":"SenderExplicitMarketingConsent",
					"Description":"I agree to receiving marketing material at this phone number and email address.",
					"DataType":"Boolean"
					,"PictForm": { "Section":"Confirmation", "Row":1, "Width":2 }
				}
		}
}
```

This [manyfest](https://github.com/stevenvelozo/manyfest) file describes a list
of application state elements. And intersects these data elements with how
they should be presented to the user in a form.  This can work for any layout
of data in your application.


