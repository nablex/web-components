Vue.component("n-form-checkbox", {
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
		// whether or not you are in edit mode
		edit: {
			type: Boolean,
			required: false,
			default: true
		},
		required: {
			type: Boolean,
			required: false,
			// explicitly set default value to null, otherwise vue will make it false which we can't distinguish from "not set"
			default: null
		},
		name: {
			type: String,
			required: false
		},
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		hide: {
			type: Boolean,
			required: false,
			default: null
		},
		disabled: {
			type: Boolean,
			required: false
		},
		inverse: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: "#n-form-checkbox",
	data: function() {
		return {
			messages: [],
			valid: null,
			calculatedValue: false
		};
	},
	created: function() {
		this.calculatedValue = this.invertIfNecessary(this.value instanceof Array ? this.value.indexOf(this.item) >= 0 : this.value);
	},
	computed: {
		definition: function() {
			return nabu.utils.vue.form.definition(this);
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	methods: {
		invertIfNecessary: function(value) {
			return this.invert ? !value : value;
		},
		validate: function() {
			var messages = nabu.utils.schema.json.validate(this.definition, this.value, this.mandatory);
			for (var i = 0; i < messages.length; i++) {
				messages[i].component = this;
			}
			this.valid = messages.length == 0;
			return messages;
		}, 
		toggleValue: function() {
			if (!this.disabled && this.edit) {
				if (this.value instanceof Array) {
					var index = this.value.indexOf(this.item);
					if (index >= 0) {
						this.value.splice(index, 1);
					}
					else {
						this.value.push(this.item);
					}
				}
				else {
					this.$emit("input", !this.calculatedValue);
				}
			}
		},
		updateChecked: function(value) {
			if (this.$refs && this.$refs.input) {
				if (value) {
					this.$refs.input.setAttribute("checked", "true");
				}
				else {
					this.$refs.input.removeAttribute("checked");
				}
			}
		}
	},
	watch: {
		value: function(newValue) {
			this.calculatedValue = this.invertIfNecessary(newValue instanceof Array ? newValue.indexOf(this.item) >= 0 : newValue);
			this.updateChecked(this.calculatedValue);
		}
	}
});

Vue.directive("checked", {
	bind: function(element, binding) {
		if ((binding.value instanceof Array && binding.length) || (!(binding.value instanceof Array) && binding.value)) {
			element.setAttribute("checked", "true");
		}
		else {
			element.removeAttribute("checked");
		}
	}
});
