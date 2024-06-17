module.exports = (
{
	"TemplatePrefix": "Pict-Forms-Basic",
	"Templates":
	[
		/*
		 *
		 * [ Metacontroller Templates ]
		 *
		 */
		// the form "Header", rendered once before the dynamic views, after which come the section(s), then their group(s)
		{
			"HashPostfix": "-Template-Form-Container-Header",
			"Template": /*HTML*/`
<!-- Pict Form Metacontroller container Header

  ;,//;,    ,;/
 o:::::::;;///
>::::::::;;\\\
  ''\\\\\'" ';\

Glug glug glug Oo... -->
<div id="Pict-{~D:Context[0].UUID~}-FormContainer" class="pict-form">`
		},
		// 
		{
			"HashPostfix": "-Template-Form-Container-Wrap-Prefix",
			"Template": /*HTML*/`
<!-- Pict Form Metacontroller container [{~D:Context[0].UUID~}] -->
<div id="Pict-{~D:Context[0].UUID~}-{~D:Record.options.Hash~}-Wrap" class="pict-form">`
		},
		// the container div into which the actual view renders.
		// if you overwrite this template, make sure this ID is available on a container somewhere or auto rendering won't work
		{
			"HashPostfix": "-Template-Form-Container",
			"Template": /*HTML*/`

	<!-- Pict Form View Container [{~D:Record.UUID~}]::[{~D:Record.Hash~}] -->
	<div id="Pict-Form-Container-{~D:Record.options.Hash~}" class="pict-form-view"></div>`
		},

		// -Form-Container-Wrap-Postfix
		{
			"HashPostfix": "-Template-Form-Container-Wrap-Postfix",
			"Template": /*HTML*/`
</div>
<!-- Pict Form Metacontroller container [{~D:Context[0].UUID~}] -->
`
		},


		/*
		 *
		 * [ Basic Form Templates START ]
		 *
		 */
		// the wrapping container for a view which is a collection of form section(s)...
		{
			"HashPostfix": "-Template-Wrap-Prefix",
			"Template": /*HTML*/`
	<!-- Pict Form Wrap Prefix [{~D:Context[0].UUID~}]::[{~D:Context[0].Hash~}] -->
`
		},
		{
			"HashPostfix": "-Template-Wrap-Postfix",
			"Template": /*HTML*/`
	<!-- Pict Form Wrap Postfix [{~D:Context[0].UUID~}]::[{~D:Context[0].Hash~}] -->
`
		},
		// the wrapping container for each specific section in a form... for legends and the like
		{
			"HashPostfix": "-Template-Section-Prefix",
			"Template": /*HTML*/`
		<!-- Form Section Prefix [{~D:Context[0].UUID~}]::[{~D:Context[0].Hash~}] {~D:Record.Hash~}::{~D:Record.Name~} -->
		<div class="pict-form-section">
		<h2>{~D:Record.Name~}</h2>
`
		},
		// -Form-Template-Section-Postfix
		{
			"HashPostfix": "-Template-Section-Postfix",
			"Template": /*HTML*/`
		</div>
		<!-- Form Section Postfix [{~D:Context[0].UUID~}]::[{~D:Context[0].Hash~}] {~D:Record.Hash~}::{~D:Record.Name~} -->
`
		},

		/*
		 * BEGIN Group and Row Templates (default)
		 */
		// a "group" is a cluster of inputs that are further categorized into row(s)
		{
			"HashPostfix": "-Template-Group-Prefix",
			"Template": /*HTML*/`
			<!-- Form Template Group Prefix [{~D:Context[0].UUID~}]::[{~D:Context[0].Hash~}] {~D:Record.Hash~}::{~D:Record.Name~} -->
			<h3>Group: {~D:Record.Name~}</h3>
			<div>
`
		},
		// row(s) are useful when our form has multiple inputs on some lines and a single on another...
		// like city, state and zip all in the same "row" of an address form
		{
			"HashPostfix": "-Template-Row-Prefix",
			"Template": /*HTML*/`
				<!-- Form Template Row Prefix [{~D:Context[0].UUID~}]::[{~D:Context[0].Hash~}] {~D:Record.Hash~}::{~D:Record.Name~} -->
				<div>
`
		},
		{
			"HashPostfix": "-Template-Row-Postfix",
			"Template": /*HTML*/`
				</div>
				<!-- Form Template Row Postfix [{~D:Context[0].UUID~}]::[{~D:Context[0].Hash~}] {~D:Record.Hash~}::{~D:Record.Name~} -->
`
		},
		{
			"HashPostfix": "-Template-Group-Postfix",
			"Template": /*HTML*/`
			</div>
			<!-- Form Template Group Prefix [{~D:Context[0].UUID~}]::[{~D:Context[0].Hash~}] {~D:Record.Hash~}::{~D:Record.Name~} -->
`
		},
		/*
		 * END Group and Row Templates (default)
		 */

		/*
		 * BEGIN Input Templates (default)
		 */
		{
			"HashPostfix": "-Template-Input",
			"Template": /*HTML*/`
					<!-- DEFAULT Input {~"D:Record.Hash~} {~D:Record.DataType~} -->
					<span>{~D:Record.Name~}:</span> <input type="text" {~D:Record.Macro.InputFullProperties~} {~D:Record.Macro.InputChangeHandler~} value="">
`
		},
		{
			"HashPostfix": "-Template-Input-DataType-String",
			"Template": /*HTML*/`
					<!-- DataType Number {~D:Record.Hash~} {~D:Record.DataType~} -->
					<span>{~D:Record.Name~}:</span> <input type="text" {~D:Record.Macro.InputFullProperties~} {~D:Record.Macro.InputChangeHandler~} value="">
`
		},
		{
			"HashPostfix": "-Template-Input-DataType-Number",
			"Template": /*HTML*/`
					<!-- DataType Number {~D:Record.Hash~} {~D:Record.DataType~} -->
					<span>{~D:Record.Name~}:</span> <input type="Number" {~D:Record.Macro.InputFullProperties~} {~D:Record.Macro.InputChangeHandler~} value="">
`
		},
		{
			"HashPostfix": "-Template-Input-InputType-TextArea",
			"Template": /*HTML*/`
					<!-- InputType TextArea {~D:Record.Hash~} {~D:Record.DataType~} -->
					<span>{~D:Record.Name~}:</span> <textarea {~D:Record.Macro.InputFullProperties~} {~D:Record.Macro.InputChangeHandler~}></textarea>
`
		},
		/*
		 * END Input Templates (default)
		 */
		/*
		 *
		 * [ Basic Form Templates END ]
		 *
		 */



		/*
		 *
		 * [ Tabular Templates START ]
		 *
		 */
		{
			"HashPostfix": "-TabularTemplate-Group-Prefix",
			"Template": /*HTML*/`
			<div>
			<table>
					<tbody>
			<!-- Form Tabular Template Group Prefix [{~D:Context[0].UUID~}]::[{~D:Context[0].Hash~}] {~D:Record.Hash~}::{~D:Record.Name~} -->
`
		},
		{
			"HashPostfix": "-TabularTemplate-Group-Postfix",
			"Template": /*HTML*/`
				</tbody>
			</table>
			<div><a href="#" onclick="{~D:Record.Macro.TabularCreateRowFunctionCall~}">create</a></div>
			</div>
			<!-- Form Tabular Template Group Prefix [{~D:Context[0].UUID~}]::[{~D:Context[0].Hash~}] {~D:Record.Hash~}::{~D:Record.Name~} -->
`
		},

		/*
		 * BEGIN Tabular Template "Extra" Columns
		 * these are meant to be easy ways to add controls to the left or right side of a record column
		 */
		{
			"HashPostfix": "-TabularTemplate-RowHeader-ExtraPrefix",
			"Template": /*HTML*/`<!-- TabularTemplateRowHeader-ExtraPrefix -->`
		},
		// because the row extension template below adds an extra column, we need to make our header have parity
		{
			"HashPostfix": "-TabularTemplate-RowHeader-ExtraPostfix",
			"Template": /*HTML*/`<!-- TabularTemplateRowHeader-ExtraPostfix -->
						<th style="min-width:100px;"></th>
`
		},
		{
			"HashPostfix": "-TabularTemplate-Row-ExtraPrefix",
			"Template": /*HTML*/`<!-- TabularTemplateRow-ExtraPrefix -->`
		},
		// by default PICT puts a "delete row" button on the right side of a tabular templateset
		{
			"HashPostfix": "-TabularTemplate-Row-ExtraPostfix",
			"Template": /*HTML*/`<!-- TabularTemplateRow-ExtraPostfix-->
					<td><a href="#" onClick="_Pict.views['{~D:Context[0].Hash~}'].deleteDynamicTableRow({~D:Record.Group~},'{~D:Record.Key~}')">del</a>
					<a href="#" onClick="_Pict.views['{~D:Context[0].Hash~}'].moveDynamicTableRowUp({~D:Record.Group~},'{~D:Record.Key~}')">up</a>
					<a href="#" onClick="_Pict.views['{~D:Context[0].Hash~}'].moveDynamicTableRowDown({~D:Record.Group~},'{~D:Record.Key~}')">down</a></td>
`
		},
		/*
		 * END Tabular Template "Extra" Columns
		 */

		/*
		 * BEGIN Tabular Template Header Columns
		 */
		{
			"HashPostfix": "-TabularTemplate-RowHeader-Prefix",
			"Template": /*HTML*/`
				<thead>
					<tr>
`
		},
		{
			"HashPostfix": "-TabularTemplate-HeaderCell",
			"Template": /*HTML*/`
						<!-- Descriptor {~D:Record.Name~} [{~D:Record.Hash~}] -> {~D:Record.Address~} -->
						<th>{~D:Record.Name~}</th>
`
		},
		{
			"HashPostfix": "-TabularTemplate-RowHeader-Postfix",
			"Template": /*HTML*/`
					</tr>
				</thead>
				<tbody>
`
		},
		/*
		 * END Tabular Template Header Columns
		 */

		/*
		 * BEGIN Tabular TemplateSet Templates (row and cell prefix/postfix ... tr/td)
		 * (these are repeated for each "row" which is a record, and then wrap each "cell" which is a columnar input)
		 */
		{
			"HashPostfix": "-TabularTemplate-Row-Prefix",
			"Template": /*HTML*/`
					<tr>{~T:TabularTemplateRow-ExtraPrefix~}
`
		},
		{
			"HashPostfix": "-TabularTemplate-Cell-Prefix",
			"Template": /*HTML*/`
						<td><!-- {~D:Record.Name~}  -->
`
		},
		{
			"HashPostfix": "-TabularTemplate-Cell-Postfix",
			"Template": /*HTML*/`
						</td>
`
		},
		{
			"HashPostfix": "-TabularTemplate-Row-Postfix",
			"Template": /*HTML*/`
					{~T:TabularTemplateRow-ExtraPostfix~}</tr>`
		},
		/*
		 * END Tabular TemplateSet Templates
		 */


		/*
		 * BEGIN Tabular Input Templates
		 */
		{
			"HashPostfix": "-TabularTemplate-Begin-Input",
			"Template": /*HTML*/`
					<!-- DEFAULT Input {~"D:Record.Hash~} {~D:Record.DataType~} -->
					<input type="text" {~D:Record.Macro.HTMLName~} {~D:Record.Macro.InformaryTabular~} `
		},
		{
			"HashPostfix": "-TabularTemplate-End-Input",
			"Template": /*HTML*/` {~D:Record.Macro.InputChangeHandler~} value="">`
		},

		{
			"HashPostfix": "-TabularTemplate-Begin-Input-DataType-String",
			"Template": /*HTML*/`
					<!-- DataType Number {~D:Record.Hash~} {~D:Record.DataType~} -->
					<input type="text" {~D:Record.Macro.HTMLName~} {~D:Record.Macro.InformaryTabular~} `
		},
		{
			"HashPostfix": "-TabularTemplate-End-Input-DataType-String",
			"Template": /*HTML*/` {~D:Record.Macro.InputChangeHandler~} value="">`
		},

		{
			"HashPostfix": "-TabularTemplate-Begin-Input-DataType-Number",
			"Template": /*HTML*/`
					<!-- DataType Number {~D:Record.Hash~} {~D:Record.DataType~} -->
					<input type="Number" {~D:Record.Macro.HTMLName~} {~D:Record.Macro.InformaryTabular~} `
		},
		{
			"HashPostfix": "-TabularTemplate-End-Input-DataType-Number",
			"Template": /*HTML*/` {~D:Record.Macro.InputChangeHandler~} value="">
`
		},
		{
			"HashPostfix": "-TabularTemplate-Begin-Input-InputType-TextArea",
			"Template": /*HTML*/`
					<!-- InputType TextArea {~D:Record.Hash~} {~D:Record.DataType~} -->
					<textarea {~D:Record.Macro.HTMLName~} {~D:Record.Macro.InformaryTabular~} `
		},
		{
			"HashPostfix": "-TabularTemplate-End-Input-InputType-TextArea",
			"Template": /*HTML*/` {~D:Record.Macro.InputChangeHandler~}></textarea>
`
		}
		/*
		 * END Tabular Input Templates
		 */
		/*
		 *
		 * [ Tabular Templates END ]
		 *
		 */

	]
});