window.addEventListener("load", function() {
	if (application && nabu && nabu.page) {
		Vue.component("page-form-input-qr-configure", {
			template: "<n-form-section>"
				+ "	<n-form-switch v-model='field.allowManualEntry' label='Allow manual entry' />"
				+ "	<n-form-text type='number' v-model='field.canvasWidth' label='Width (in pixels)' />"
				+ "	<n-form-text type='number' v-model='field.canvasHeight' label='Height (in pixels)' />"
				+ "	<n-form-text v-model='field.manualLabel' label='Manual Label' />"
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
			}
		});

		Vue.component("page-form-input-qr", {
			template: "<n-form-qr :allow-manual='field.allowManualEntry' ref='form'"
					+ "		:schema='schema'"
					+ "		@input=\"function(newValue) { $emit('input', newValue) }\""
					+ "		:label='label'"
					+ "		:value='value'"
					+ "		:name='field.name'"
					+ "		:timeout='timeout'"
					+ "		:width='field.canvasWidth'"
					+ "		:height='field.canvasHeight'"
					+ "		:manual-label='$services.page.translate($services.page.interpret(field.manualLabel, $self))'"
					+ "		:disabled='disabled'/>",
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
		});
	}
});    