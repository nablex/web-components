Vue.component("n-form-date", {
	props: {
		value: {
			required: true
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
		required: {
			type: Boolean,
			required: false,
			default: null
		},
		name: {
			type: String,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		schema: {
			type: Object,
			required: false
		},
		pattern: {
			type: String,
			required: false
		},
		minLength: {
			type: Number,
			required: false
		},
		maxLength: {
			type: Number,
			required: false
		},
		type: {
			type: String,
			required: false,
			default: "text"
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
		validator: {
			type: Function,
			required: false
		},
		unique: {
			type: Boolean,
			required: false
		},
		parser: {
			type: Function,
			required: false
		},
		formatter: {
			type: Function,
			required: false
		},
		minimum: {
			required: false
		},
		maximum: {
			required: false
		},
		allow: {
			type: Function,
			required: false
		},
		// whether you want a string or a date as object
		stringify: {
			type: Boolean,
			required: false,
			default: false
		},
		// the timeout is the timeout that is used when manually typing the date
		// make sure this is high enough, because once it times out, the system will try to parse whatever there is to a date
		// so if you just typed "1" and it immediately parses it, this becomes very annoying
		// also: selenium can't handle a timeout of 0 as it sends key by key, so the first key triggers a date generation and the other keys are just pasted after the date
		timeout: {
			type: Number,
			required: false,
			default: 600
		},
		// selenium has problems clearing the popup if the timeout is below say 100ms
		// because when the popup opens, it grabs focus (presumably) and the clear goes to the popup, not the input form
		popup: {
			type: Number,
			required: false
		}
	},
	template: "#n-form-date",
	data: function() {
		return {
			messages: [],
			valid: null,
			show: false,
			date: null
		}
	},
	created: function() {
		if (this.value instanceof Date) {
			this.date = this.formatter ? this.formatter(this.value) : this.value.toISOString().substring(0, 10);
		}
		else {
			this.date = this.value;
		}
	},
	methods: {
		updateValue: function(value) {
			if (this.stringify) {
				this.$emit("input", value);
			}
			else {
				this.$emit("input", this.parser ? this.parser(value) : new Date(value));
			}
		},
		dateValidate: function(value) {
			var messages = [];
			if (this.validator) {
				var childMessages = this.validator(value);
				if (childMessages) {
					nabu.utils.arrays.merge(messages, childMessages);
				}
			}
			if (value && this.$refs.dateInput && isNaN(this.$refs.dateInput.parse(value).getTime())) {
				messages.push({
					severity: "error",
					code: "type",
					values: {
						actual: value,
						expected: "date"
					},
					context: []
				});
			}
			return messages;
		},
		validate: function() {
			var messages = this.$refs.text.validate();
			this.valid = !messages.length;
			return messages;
		},
		showPopup: function() {
			if (this.popup) {
				var self = this;
				setTimeout(function() {
					self.show = self.edit && !self.disabled;
				}, this.popup);
			}
		}
	},
	watch: {
		date: function(newValue) {
			if (!newValue) {
				if (this.value) {
					this.$emit("input", null);
				}
			}
			else if (this.stringify) {
				if (this.value != newValue) {
					this.$emit("input", newValue);
				}
			}
			else {
				newValue = this.parser ? this.parser(newValue) : new Date(newValue);
				if (!this.value || newValue.getTime() != this.value.getTime()) {
					this.$emit("input", newValue);
				}
			}
		},
		value: function(newValue) {
			if (newValue instanceof Date) {
				this.date = this.formatter ? this.formatter(newValue) : newValue.toISOString().substring(0, 10);
			}
			else {
				this.date = newValue;
			}
		}
	}
});