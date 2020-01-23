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
		step: {
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
		},
		autoScale: {
			type: Boolean,
			required: false,
			default: false
		},
		info: {
			type: String,
			required: false
		},
		suffix: {
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
		allow: {
			type: Function,
			required: false
		}
	},
	template: "#n-form-text",
	data: function() {
		return {
			messages: [],
			valid: null,
			timer: null,
			localValue: null
		};
	},
	created: function() {
		this.localValue = this.value;
	},
	computed: {
		rows: function() {
			if (this.autoScale) {
				if (!this.value) {
					return 1;
				}
				else {
					return this.value.length - this.value.replace(/\n/g, "").length + 1;
				}
			}
			return null;
		},
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
		mergeContent: function(content) {
			return this.$refs.input.value
				? this.$refs.input.value.substring(0, this.$refs.input.selectionStart) + content + 
					this.$refs.input.value.substring(this.$refs.input.selectionEnd)
				: content;
		},
		pasteHandler: function($event) {
			var clipboardData = clipboardData = $event.clipboardData || window.clipboardData;
			var content = clipboardData.getData('Text');
			if (this.allow) {
				var response = this.allow(null, this.mergeContent(content));
				// if you send back a string, it is assumed to be the complete string, not a rewrite of the new part
				if (typeof(response) == "string") {
					var current = this.$refs.input.selectionStart;
					this.$refs.input.value = response;
					this.$refs.input.selectionEnd = Math.min(current + 1, response.length);
					//this.$refs.input.selectionStart = Math.min(current, response.length);
					$event.preventDefault();
					$event.stopPropagation();
				}
				// if we have any negative feedback, don't allow the paste
				else if ((response instanceof Array && response.length > 0) || !response) {
					$event.preventDefault();
					$event.stopPropagation();
				}
			}
		},
		checkKey: function($event) {
			if (this.allow && $event.key) {
				var result = this.allow($event.key, this.mergeContent($event.key));
				// you can send back an array of validation messages
				// this can't be asynchronous because we need to block the event _now_
				if (result instanceof Array) {
					if (result.length > 0) {
						$event.preventDefault();
						return false;
					}
				}
				// if we send back a string, we may have modified the end result
				else if (typeof(result) == "string") {
					var current = this.$refs.input.selectionStart;
					this.$refs.input.value = result;
					this.$refs.input.selectionEnd = Math.min(current + 1, result.length);
					//this.$refs.input.selectionStart = Math.min(current, result.length);
					$event.preventDefault();
				}
				else if (!result) {
					$event.preventDefault();
					return false;
				}
			}
			return true;
		},
		focus: function($event) {
			this.$emit('focus', $event);
			if (this.autoSelect) {
				this.$refs.input.select();
			}
		},
		validate: function(soft) {
			// in some cases you block the update of the value if the validation fails, however this is a catch 22 if we use the value itself for validation
			var valueToValidate = this.edit ? this.$refs.input.value : this.value;
			// reset current messages
			this.messages.splice(0);
			// this performs all basic validation and enriches the messages array to support asynchronous
			var messages = nabu.utils.schema.json.validate(this.definition, valueToValidate, this.mandatory);
			// add context to the messages to we can link back to this component
			for (var i = 0; i < messages.length; i++) {
				messages[i].component = this;
			}
			// allow for unique validation
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
			// allow for custom validation
			messages = nabu.utils.vue.form.validateCustom(messages, valueToValidate, this.validator, this);

			var self = this;
			messages.then(function(validations) {
				var hardMessages = messages.filter(function(x) { return !x.soft });
				// if we are doing a soft validation and all messages were soft, set valid to unknown
				if (soft && hardMessages.length == 0 && (messages.length > 0 || !valueToValidate) && self.valid == null) {
					self.valid = null;
				}
				else {
					self.valid = messages.length == 0;
					nabu.utils.arrays.merge(self.messages, nabu.utils.vue.form.localMessages(self, messages));
				}
			});
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
			this.localValue = this.value;
		}
	}
});

HTMLTextAreaElement.prototype.insertAtCaret = function(text) {
	text = text || '';
	// IE
	if (document.selection) {
		this.focus();
		var sel = document.selection.createRange();
		sel.text = text;
	}
	else if (this.selectionStart || this.selectionStart === 0) {
		// Others
		var startPos = this.selectionStart;
		var endPos = this.selectionEnd;
		this.value = this.value.substring(0, startPos) + text
			+ this.value.substring(endPos, this.value.length);
		this.selectionStart = startPos + text.length;
		this.selectionEnd = startPos + text.length;
	}
	else {
		this.value += text;
	}
};

HTMLInputElement.prototype.insertAtCaret = function(text) {
	text = text || '';
	// IE
	if (document.selection) {
		this.focus();
		var sel = document.selection.createRange();
		sel.text = text;
	}
	else if (this.selectionStart || this.selectionStart === 0) {
		// Others
		var startPos = this.selectionStart;
		var endPos = this.selectionEnd;
		this.value = this.value.substring(0, startPos) + text
			+ this.value.substring(endPos, this.value.length);
		this.selectionStart = startPos + text.length;
		this.selectionEnd = startPos + text.length;
	}
	else {
		this.value += text;
	}
};


