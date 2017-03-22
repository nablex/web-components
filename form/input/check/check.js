Vue.component("n-form-checkbox", {
	props: {
		value: {
			required: true
		},
		item: {
			required: false,
		},
		label: {
			type: String,
			required: false
		},
		// whether or not you are in edit mode
		edit: {
			type: Boolean,
			required: false
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
		}
	},
	template: "#n-form-checkbox",
	data: function() {
		return {
			messages: [],
			valid: null
		};
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
						this.$refs.input.removeAttribute("checked");
					}
					else {
						this.value.push(this.item);
						this.$refs.input.setAttribute("checked", "true");
					}
				}
				else {
					var value = !this.value;
					this.$emit("input", value);
					if (value) {
						this.$refs.input.setAttribute("checked", "true");
					}
					else {
						this.$refs.input.removeAttribute("checked");
					}
				}
			}
		}
	}
});