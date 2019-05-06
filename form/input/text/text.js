Vue.component("n-form-text", {
	props: {
		value: {
			required: true
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
		placeholder: {
			type: String,
			required: false
		},
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		pattern: {
			type: String,
			required: false
		},
		patternComment: {
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
		caseSensitive: {
			type: Boolean,
			required: false,
			default: true
		},
		timeout: {
			type: Number,
			required: false
		},
		maximum: {
			type: Number,
			required: false
		},
		minimum: {
			type: Number,
			required: false
		},
		exclusiveMaximum: {
			type: Number,
			required: false
		},
		exclusiveMinimum: {
			type: Number,
			required: false
		},
		trim: {
			type: Boolean,
			required: false,
			default: false
		},
		mode: {
			type: String,
			required: false
		},
		autoSelect: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: "#n-form-text",
	data: function() {
		return {
			messages: [],
			valid: null,
			timer: null
		};
	},
	computed: {
		definition: function() {
			var definition = nabu.utils.vue.form.definition(this);
			if (this.type == "number") {
				definition.type = "number";
			}
			return definition;
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	methods: {
		focus: function($event) {
			this.$emit('focus', $event);
			if (this.autoSelect) {
				this.$refs.input.select();
			}
		},
		handleKeyup: function($event) {
			this.$emit('keyup', $event);
		},
		validate: function(soft) {
			// in some cases you block the update of the value if the validation fails, however this is a catch 22 if we use the value itself for validation
			//var valueToValidate = this.value;
			var valueToValidate = this.$refs.input.value;
			this.messages.splice(0, this.messages.length);
			var messages = nabu.utils.schema.json.validate(this.definition, valueToValidate, this.mandatory);
			for (var i = 0; i < messages.length; i++) {
				messages[i].component = this;
			}
			if (valueToValidate != null && this.unique && this.$group) {
				var count = 0;
				for (var i = 0; i < this.$group.length; i++) {
					// only count visible items
					if (this.$group[i].$el && this.$document.body.contains(this.$group[i].$el)) {
						if (this.$group[i].value == valueToValidate) {
							count++;
						}
						else if (!this.caseSensitive && this.$group[i].value && valueToValidate && this.$group[i].value.toLowerCase() == valueToValidate.toLowerCase()) {
							count++;
						}
					}
				}
				if (count > 1) {
					messages.push({
						code: "unique",
						component: this,
						context: [],
						severity: "error",
						values: {
							expected: 1,
							actual: count,
							value: valueToValidate
						}
					});
				}
			}
			if (this.validator != null) {
				var additional = this.validator(valueToValidate);
				if (additional != null && additional.length) {
					for (var i = 0; i < additional.length; i++) {
						additional[i].component = this;
						if (typeof(additional[i].context) == "undefined") {
							additional[i].context = [];
						}
						messages.push(additional[i]);
					}
				}
				else if (additional != null && additional.then) {
					messages.defer(additional);
				}
			}
			var hardMessages = messages.filter(function(x) { return !x.soft });
			// if we are doing a soft validation and all messages were soft, set valid to unknown
			if (soft && hardMessages.length == 0 && (messages.length > 0 || !valueToValidate) && this.valid == null) {
				this.valid = null;
				// remove local messages
				this.messages.splice(0);
			}
			else {
				this.valid = messages.length == 0;
				nabu.utils.arrays.merge(this.messages, nabu.utils.vue.form.localMessages(this, messages));
			}
			return messages;
		}, 
		updateValue: function(value) {
			if (this.trim && typeof(value) != "undefined" && value != null) {
				value = value.trim();
			}
			if (value != this.value) {
				// empty string means empty text field, we assume it is null then
				if (value == "") {
					value = null;
				}
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
				// always emit the change event, it is not subject to timeout
				this.$emit("change", value);
				if (this.timeout) {
					var self = this;
					this.timer = setTimeout(function() {
						self.$emit("input", value);
					}, this.timeout);
				}
				else {
					this.$emit("input", value);
				}
			}
		}
	},
	watch: {
		// reset validity if the value is updated
		value: function(newValue) {
			this.valid = null;
			// remove local messages
			this.messages.splice(0);
		}
	}
});