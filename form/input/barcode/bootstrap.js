// https://github.com/serratus/quaggaJS
// TODO: some more subtypes of readers are possible by sending in specific configuration options
window.addEventListener("load", function() {
	if (application && nabu && nabu.page) {
		Vue.component("page-form-input-barcode-configure", {
			template: "<n-form-section>"
				+ "	<n-form-switch v-model='field.allowManualEntry' label='Allow manual entry' />"
				+ "	<n-form-text type='number' v-model='field.canvasWidth' label='Width (in pixels)' />"
				+ "	<n-form-text type='number' v-model='field.canvasHeight' label='Height (in pixels)' />"
				+ "	<div class='list' v-if='field.decoders'>"
				+ "		<div v-for='i in Object.keys(field.decoders)' class='list-row'>"
				+ "			<n-form-combo v-model='field.decoders[i]' :items=\"['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader', 'codabar_reader', 'upc_reader', 'upc_e_reader', 'i2of5_reader', '2of5_reader', 'code_93_reader']\"/>"
				+ "			<button @click='field.decoders.splice(i)'><span class='fa fa-trash'></span></button>"
				+ "		</div>"
				+ "	</div>"
				+ "	<button @click=\"field.decoders ? field.decoers.push(null) : $window.Vue.set(field, 'decoders', [null])\">Add Barcode Type</button>"
				+ "	<n-form-text v-model='field.icon' label='Icon' />"
				+ "	<n-form-text v-model='field.buttonLabel' label='Buton Label' />"
				+ "	<n-form-switch v-model='field.manualEntry' label='Manual Entry' />"
				+ "	<n-form-text v-if='field.manualEntry' v-model='field.manualLabel' label='Manual Label' />"
				+ "	<n-page-mapper v-model='field.bindings' :from='availableParameters' :to='[\"validator\"]'/>"
				+ "</n-form-section>",
			props: {
				cell: {
					type: Object,
					required: true
				},
				page: {
					type: Object,
					required: true
				},
				// the fragment this image is in
				field: {
					type: Object,
					required: true
				}
			},
			created: function() {
				if (!this.field.bindings) {
					Vue.set(this.field, "bindings", {});
				}
			},
			computed: {
				availableParameters: function() {
					return this.$services.page.getAvailableParameters(this.page, this.cell, true);
				}
			}
		});

		Vue.component("page-form-input-barcode", {
			template: "<n-form-barcode :allow-manual='field.allowManualEntry' ref='form'"
				+ "	:schema='schema'"
				+ "	@input=\"function(newValue) { $emit('input', newValue) }\""
				+ "	:label='label'"
				+ "	:value='value'"
				+ "	:name='field.name'"
				+ "	:decoders='field.decoders'"
				+ "	:timeout='timeout'"
				+ "	:validator='getValidator()'"
				+ "	:width='field.canvasWidth'"
				+ "	:height='field.canvasHeight'"
				+ "	:button-label='$services.page.translate($services.page.interpret(field.buttonLabel, $self))'"
				+ "	:manual-label='$services.page.translate($services.page.interpret(field.manualLabel, $self))'"
				+ "	:placeholder='placeholder ? $services.page.translate($services.page.interpret(placeholder, $self)) : null'"
				+ "	:icon='field.icon'"
				+ "	:disabled='disabled'/>",
			props: {
				cell: {
					type: Object,
					required: true
				},
				page: {
					type: Object,
					required: true
				},
				field: {
					type: Object,
					required: true
				},
				value: {
					required: true
				},
				label: {
					type: String,
					required: false
				},
				timeout: {
					required: false
				},
				disabled: {
					type: Boolean,
					required: false
				},
				schema: {
					type: Object,
					required: false
				},
				readOnly: {
					type: Boolean,
					required: false
				},
				placeholder: {
					type: String,
					required: false
				}
			},
			computed: {
				textType: function() {
					return this.field.textType ? this.field.textType : 'text';
				}
			},
			methods: {
				validate: function(soft) {
					return this.$refs.form.validate(soft);
				},
				getValidator: function() {
					if (this.field.bindings && this.field.bindings.validator) {
						var pageInstance = this.$services.page.getPageInstance(this.page, this);
						return this.$services.page.getBindingValue(pageInstance, this.field.bindings.validator, this);
					}
				}
			}
		});
		application.bootstrap(function($services) {
			nabu.page.provide("page-form-input", { 
				component: "page-form-input-barcode", 
				configure: "page-form-input-barcode-configure", 
				name: "barcode",
				namespace: "nabu.page"
			});
		});
	}
});    