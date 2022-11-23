window.addEventListener("load", function() {
	if (application && nabu && nabu.page) {
		Vue.component("page-form-input-qr-configure", {
			template: "<n-form-section>"
				+ "	<n-form-switch v-model='field.allowManualEntry' label='Allow manual entry' v-if='false' />"
				+ "	<n-form-text type='number' v-model='field.canvasWidth' label='Width (in pixels)' />"
				+ "	<n-form-text type='number' v-model='field.canvasHeight' label='Height (in pixels)' />"
				+ "	<n-form-text v-model='field.icon' label='Icon' />"
				+ "	<n-form-text v-model='field.buttonLabel' label='Buton Label' />"
				+ "	<n-form-text v-if='field.allowManualEntry' v-model='field.manualLabel' label='Manual Label' />"
				+ "	<n-form-switch v-model='field.zoom' label='Zoom' info='Whether or not we should allow zooming in if the device supports it' />"
				+ "	<n-form-switch v-if='hasQrRenderer' v-model='field.showScannedQRCode' label='When scanned, display the qr code' />"
				+ "	<p v-else>If you plug in the service nabu.libs.misc.qr.web.render, you can choose to render the qr code you just scanned.</p>"
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
				},
				hasQrRenderer: function() {
					console.log("qr rendering", this.$services.swagger.operations, this.$services.swagger.operations["nabu.libs.misc.qr.web.render"]);
					return this.$services.swagger.operations["nabu.libs.misc.qr.web.render"] != null;
				}
			}
		});

		Vue.component("page-form-input-qr", {
			template: "<n-form-qr :manual-entry='field.allowManualEntry' ref='form'"
				+ "	:schema='schema'"
				+ "	@input=\"function(newValue) { $emit('input', newValue) }\""
				+ "	:label='label'"
				+ "	:value='value'"
				+ "	:name='field.name'"
				+ "	:timeout='timeout'"
				+ "	:validator='getValidator()'"
				+ "	:width='field.canvasWidth'"
				+ "	:height='field.canvasHeight'"
				+ "	:button-label='$services.page.translate($services.page.interpret(field.buttonLabel, $self))'"
				+ "	:manual-label='$services.page.translate($services.page.interpret(field.manualLabel, $self))'"
				+ "	:placeholder='placeholder ? $services.page.translate($services.page.interpret(placeholder, $self)) : null'"
				+ "	:switch-qr-code='field.showScannedQRCode'"
				+ "	:icon='field.icon'"
				+ "	:zoom='field.zoom'"
				+ "	:class=\"getChildComponentClasses('scan-component')\""
				+ "	:button-class=\"getChildComponentClasses('scan-button')\""
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
				},
				childComponents: {
					type: Object,
					required: false
				}
			},
			computed: {
				textType: function() {
					return this.field.textType ? this.field.textType : 'text';
				}
			},
			methods: {
				getChildComponents: function() {
					return [{
						title: "Scan Component (qr)",
						name: "scan-component",
						component: "form-qr"
					}, {
						title: "Scan Button",
						name: "scan-button",
						component: "button"
					}];
				},
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
				component: "page-form-input-qr", 
				configure: "page-form-input-qr-configure", 
				name: "qr",
				namespace: "nabu.page"
			});
			$services.router.register({
				alias: "page-form-qr",
				enter: function(parameters) {
					// do not modify parameters directly, this may lead to rerendering issues
					var cloneParameters = {};
					nabu.utils.objects.merge(cloneParameters, parameters);
					cloneParameters.formComponent = "page-form-input-qr";
					cloneParameters.configurationComponent = "page-form-input-qr-configure";
					return new nabu.page.views.FormComponent({propsData: cloneParameters});
				},
				form: "qr",
				category: "Form",
				name: "Qr",
				description: "A QR code reader",
				icon: "page/core/images/form-text.svg"
			});
		});

	}
});    