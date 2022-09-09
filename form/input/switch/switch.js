Vue.component("n-form-switch", {
	props: {
		value: {
			required: true
		},
		item: {
			required: false
		},
		label: {
			type: String,
			required: false
		},
		edit: {
			type: Boolean,
			required: false,
			default: true
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		invert: {
			type: Boolean,
			required: false,
			default: false
		},
		info: {
			type: String,
			required: false
		},
		infoIcon: {
			type: String,
			required: false
		},
		before: {
			type: String,
			required: false
		},
		after: {
			type: String,
			required: false
		}
	},
	template: "#n-form-switch",
	methods: {
		updateValue: function(newValue) {
			if (!this.disabled) {
				this.$emit("input", newValue);
			}
		},
		validate: function(soft) {
			return this.$refs.form.validate(soft);
		}
	}
});
