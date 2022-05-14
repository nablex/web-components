Vue.component("n-form-checkbox", {
	props: {
		component: {
			type: String,
			default: "is-form-checkbox"
		},
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
		invert: {
			type: Boolean,
			required: false,
			default: false
		},
		validator: {
			type: Function,
			required: false
		},
		mustCheck: {
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
		},
		labelBefore: {
			type: Boolean,
			required: false
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
		var booleanValue = this.getBooleanValue(this.value);
		this.calculatedValue = this.invertIfNecessary(booleanValue);
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
		getBooleanValue: function(newValue) {
			var booleanValue = false;
			// for arrays we want a separate path
			if (newValue == null) {
				booleanValue = false;
			}
			else if (newValue === "false") {
				booleanValue = false;
			}
			else if (newValue === "true") {
				booleanValue = true;
			}
			if (newValue instanceof Array) {
				if (this.item instanceof Array) {
					booleanValue = true;
					for (var i = 0; i < this.item.length; i++) {
						if (newValue.indexOf(this.item[i]) < 0) {
							booleanValue = false;
							break;
						}
					}
				}
				else {
					booleanValue = newValue.indexOf(this.item) >= 0;
				}
			}
			else {
				booleanValue = newValue;
			}
			return booleanValue;
		},
		invertIfNecessary: function(value) {
			return this.invert ? !value : value;
		},
		validate: function() {
			// if the checkbox is set to mustCheck but the calculated value is null, false or undefined or anything but true, we imitate a null value to trigger the mandatory validation
			var messages = nabu.utils.schema.json.validate(this.definition, this.mustCheck && !this.calculatedValue ? null : (this.calculatedValue == null ? false : this.calculatedValue), this.mandatory || this.mustCheck);
			for (var i = 0; i < messages.length; i++) {
				Object.defineProperty(messages[i], 'component', {
					value: this,
					enumerable: false
				});
			}
			if (this.validator) {
				var additional = this.validator(this.value);
				if (additional && additional.length) {
					for (var i = 0; i < additional.length; i++) {
						Object.defineProperty(additional[i], 'component', {
							value: this,
							enumerable: false
						});
						if (typeof(additional[i].context) == "undefined") {
							additional[i].context = [];
						}
						messages.push(additional[i]);
					}
				}
			}
			this.valid = messages.length == 0;
			return messages;
		}, 
		toggleValue: function() {
			if (!this.disabled && this.edit) {
				if (this.value instanceof Array) {
					var self = this;
					var merge = function(item) {
						var index = self.value.indexOf(item);
						if (index >= 0) {
							self.value.splice(index, 1);
							self.$emit("remove", item);
						}
						else {
							self.value.push(item);
							self.$emit("add", item);
						}
					}
					// if the item itself is an array, we merge all
					if (this.item instanceof Array) {
						// we don't want to simply toggle every single entry, if you change the list of items, it will always be partially set and unset
						// this means we can never get a "full" match again
						// instead, we check what the current boolean situation is and try to invert it
						var current = this.getBooleanValue(this.value);
						this.item.forEach(function(x) {
							var index = self.value.indexOf(x);
							// if we are currently set to "true" (so everything is in there), we want to remove it
							if (current && index >= 0) {
								self.value.splice(index, 1);
								self.$emit("remove", x);
							}
							// if we are set to "false" and want to include everything, add it
							else if (!current && index < 0) {
								self.value.push(x);
								self.$emit("add", x);
							}
						});
					}
					else {
						merge(this.item);
					}
				}
				else {
					this.$emit("input", this.invertIfNecessary(!this.calculatedValue));
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
			var booleanValue = this.getBooleanValue(this.value);
			this.calculatedValue = this.invertIfNecessary(booleanValue);
			this.updateChecked(this.calculatedValue);
		}
	}
});

Vue.directive("checked", function(element, binding) {
	if ((binding.value instanceof Array && binding.length) || (!(binding.value instanceof Array) && binding.value)) {
		element.setAttribute("checked", "true");
	}
	else {
		element.removeAttribute("checked");
	}
});
