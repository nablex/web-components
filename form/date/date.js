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
		this.date = this.value;
	},
	methods: {
		updateValue: function(value) {
			this.$emit("input", value);
		},
		dateValidate: function(value) {
			var messages = [];
			if (this.validator) {
				var childMessages = this.validator(value);
				if (childMessages) {
					nabu.utils.arrays.merge(messages, childMessages);
				}
			}
			if (this.$refs.dateInput && isNaN(this.$refs.dateInput.parse(value).getTime())) {
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
		}
	},
	watch: {
		date: function(newValue) {
			this.$emit("input", newValue);
		}
	}
});