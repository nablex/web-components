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
		infoIcon: {
			type: String,
			required: false
		},
		prefix: {
			type: String,
			required: false
		},
		prefixIcon: {
			type: String,
			required: false
		},
		suffix: {
			type: String,
			required: false
		},
		suffixIcon: {
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
		},
		// if you want the value to be formatted before it is shown, set a formatter
		formatter: {
			type: Function,
			required: false
		},
		// this function is used on blur
		masker: {
			type: Function,
			required: false
		},
		// if you want the value to be parsed before it is emitted, set a parser
		parser: {
			type: Function,
			required: false
		},
		// you can set alternative text values for specific validation codes
		// send in for example {'required': 'This field is required'}
		// we support complex overrides as well where you can set {'required': { title: 'this field is required'}}
		// at this point the data will be merged
		// you can also set an array of objects [{code: 'required', title: 'this field is required'}]
		codes: {
			required: false
		},
		showTooltip: {
			type: Boolean,
			required: false,
			default: true
		},
		autocomplete: {
			type: String,
			// for chrome, if we only set it to "off", we still get the auto suggestions popup that layers over everything....
			default: window.navigator.userAgent.indexOf("Chrome") >= 0 ? "nothing" : "off"
		},
		// you can show the customer spinners (for numbers only)
		// you need css to hide the default ones then
		showCustomSpinner: {
			type: Boolean,
			default: false
		},
		autofocus: {
			type: Boolean,
			default: false
		},
		// require the user to hit "enter" to commit the value
		commit: {
			type: Boolean,
			default: false
		},
		validateOnBlur: {
			type: Boolean,
			default: false
		}
	},
	template: "#n-form-text",
	data: function() {
		return {
			messages: [],
			valid: null,
			timer: null,
			localValue: null,
			offsetX: 0,
			blurred: false,
			valueToCommit: null
		};
	},
	created: function() {
		this.localValue = this.formatter && this.value != null ? this.formatter(this.value) : this.value;
		if (this.masker) {
			this.localValue = this.value != null ? this.masker(this.value) : this.value;
		}
	},
	ready: function() {
		if (this.type == "range") {
			this.calculateOffset(this.value);
		}
		if (this.autofocus && this.$refs.input) {
			this.$refs.input.focus();
			this.$refs.input.select();
		}
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
		rangeWidth: function () {
			if (this.minimum && this.maximum && this.exclusiveMinimum && this.exclusiveMaximum) {
				return (this.maximum - this.minimum) / (this.exclusiveMaximum - this.exclusiveMinimum)*100 + "%";	
			}
			else {
				return "100%";
			}
		},
		rangeLeftOffset: function () {
			if (this.minimum && this.maximum && this.exclusiveMinimum && this.exclusiveMaximum) {
				return (this.minimum - this.exclusiveMinimum) / (this.exclusiveMaximum - this.exclusiveMinimum)*100 + "%";	
			}
			else {
				return "0%";
			}
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	methods: {
		attemptSubmit: function() {
			var el = this.$el;
			while (el) {
				if (el.tagName && el.tagName.toLowerCase() == "form") {
					var button = el.querySelector("button[type='submit']");
					if (button) {
						button.click();
					}
					break;
				}
				else {
					el = el.parentNode;
				}
			}
		},
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
					$event.preventDefault();
					$event.stopPropagation();
					this.updateValue(response);
				}
				// if we have any negative feedback, don't allow the paste
				else if ((response instanceof Array && response.length > 0) || !response) {
					$event.preventDefault();
					$event.stopPropagation();
				}
			}
		},
		checkKey: function($event) {
			if ($event.key == "Enter") {
				// ideally we want to actually run the commit value at this point...
				// but we can't seem to trigger an actual early run of the timer
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
				this.$emit("input", this.valueToCommit);
				this.$emit("commit");
			}
			if (this.allow && $event.key && !$event.ctrlKey && !$event.metaKey) {
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
					this.updateValue(result);
				}
				else if (!result) {
					$event.preventDefault();
					return false;
				}
			}
			return true;
		},
		focus: function($event) {
			this.blurred = false;
			this.$emit('focus', $event);
			if (this.autoSelect) {
				this.$refs.input.select();
			}
			if (this.masker) {
				this.localValue = this.formatter && this.value != null ? this.formatter(this.value) : this.value;
			}
		},
		blur: function (value) {
			this.blurred = true;
			this.localValue = this.masker && value != null ? this.masker(value) : value;
			this.$emit('blur');
			if (this.validateOnBlur) {
				this.validate(true);
			}
		},
		validate: function(soft) {
			// in some cases you block the update of the value if the validation fails, however this is a catch 22 if we use the value itself for validation
			if (this.masker) {
				var valueToValidate = this.value;
			}
			else {
				var valueToValidate = this.edit ? this.$refs.input.value : this.value;	
			}
			
			if (this.parser && valueToValidate != null) {
				valueToValidate = this.parser(valueToValidate);
			}
			// reset current messages
			this.messages.splice(0);
			// this performs all basic validation and enriches the messages array to support asynchronous
			var messages = nabu.utils.schema.json.validate(this.definition, valueToValidate, this.mandatory);
			// add context to the messages to we can link back to this component
			for (var i = 0; i < messages.length; i++) {
				// components are vue-based entities that have recursive links to each other, the validation messages again etc
				// we don't want to include them in the enumerable properties cause this would prevent them from ever being serialized
				// we want to keep all state serializable and validations can become part of the state
				Object.defineProperty(messages[i], 'component', {
					value: this,
					enumerable: false
				});
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
					var message = {
						code: "unique",
						context: [],
						severity: "error",
						values: {
							expected: 1,
							actual: count,
							value: valueToValidate
						}
					};
					Object.defineProperty(message, 'component', {
						value: this,
						enumerable: false
					});
					messages.push(message);
				}
			}
			// allow for custom validation
			messages = nabu.utils.vue.form.validateCustom(messages, valueToValidate, this.validator, this);

			var self = this;
			messages.then(function(validations) {
				nabu.utils.vue.form.rewriteCodes(messages, self.codes);

				// we want to separate out the info & warning messages, they should not be blocking and can be displayed alongside actual errors
				// currently the informational & warning messages are only ever shown on the component itself, not at the form level
				// this is why we are removing them from the actual messages array, they do not follow the component setting for errors (currently)
				var informational = messages.filter(function(x) { return x.severity != "error" });
				if (informational.length) {
					informational.forEach(function(x) {
						messages.splice(messages.indexOf(x), 1);
					});
				}

				self.messages.splice(0);
				var hardMessages = messages.filter(function(x) { return !x.soft });
				// if we are doing a soft validation and all messages were soft, set valid to unknown
				if (soft && hardMessages.length == 0 && (messages.length > 0 || !valueToValidate) && self.valid == null) {
					self.valid = null;
				}
				else {
					self.valid = messages.length == 0;
					nabu.utils.arrays.merge(self.messages, nabu.utils.vue.form.localMessages(self, messages));
				}
				// make sure we emit the value we just validated. in case of validate on blur (or a short validate timeout) and a longer emit timeout
				// we might be validating values that are not persisted, we can then browse to the next page without persisting it at all
				// don't send out a belated update
				if (self.timer) {
					clearTimeout(self.timer);
					self.timer = null;
				}
				// the original value can be undefined or null or an empty string
				// the valueToValidate can be any one of those too (realistically likely an empty string as we are talking about text fields)
				// to make sure we only update if it is relevant, we add this if
				// otherwise we "update" from undefined to an empty string for example which whill (after the validate) trigger the watcher which immediately resets the validation errors
				if (!(self.value == null && !valueToValidate)) {
					self.valueToCommit = self.valueToValidate;
					self.$emit("input", valueToValidate);
				}
				// if we have any informational messages, we want to show them locally
				if (informational.length) {
					nabu.utils.arrays.merge(self.messages, informational);
				}
			});
			return messages;
		}, 
		calculateOffset: function(value) {
			if (!value) {
				this.$refs.tooltip.style.display = "none";
			}
			else if (this.$refs.input) {
				var parsed = parseFloat(value);
				var range = this.$refs.input;
				var ratio = (range.value - range.min) / (range.max - range.min);
				// we need to add a bit of a correction the further we go from the left
				// this correction is currently expressed as the thumbwidth for now (long story)
				// in the future we will probably expose this as an input parameter
				var thumbWidth = 40;
				this.$refs.tooltip.style.display = "block";
				this.$refs.tooltip.style.left = Math.floor((ratio * this.$refs.input.offsetWidth) - (thumbWidth * ratio)) + "px";
			}
		},
		triggerChange: function(event) {
			// IE does not fire input events for range, but it does trigger a change event
			if (this.type == "range" && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf("rv:11.0") >= 0) {
				this.updateValue(event.target.value);
			}	
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
				// if we have a range, calculate the offset
				if (this.type == "range") {
					if (this.exclusiveMinimum != null && this.minimum != null && value < this.minimum) {
						value = this.minimum;
						this.localValue = this.formatter && this.value != null ? this.formatter(this.value) : this.value;
					}
					if (this.exclusiveMaximum != null && this.maximum != null && value > this.maximum) {
						value = this.maximum;
						this.localValue = this.formatter && this.value != null ? this.formatter(this.value) : this.value;
					}					
					this.calculateOffset(value);
				}
				var valueToEmit = this.parser && value != null ? this.parser(value) : value;
				// always emit the change event, it is not subject to timeout
				this.$emit("change", valueToEmit);
				// we always set this because we want to preemptively send it in case of commit with timeout anyway
				this.valueToCommit = valueToEmit;
				if (!this.commit) {
					if (this.timeout) {
						var self = this;
						this.timer = setTimeout(function() {
							self.$emit("input", valueToEmit);
						}, this.timeout);
					}
					else {
						this.$emit("input", valueToEmit);
					}
				}
			}
		},
        increment: function () {
                if (this.type == "number") {
					this.$refs.input.stepUp();
					this.valueToCommit = this.$refs.input.value;
					this.$emit("input", this.$refs.input.value);
                }       
        },
        decrement: function () {
                if (this.type == "number") {
					this.$refs.input.stepDown();
					this.valueToCommit = this.$refs.input.value;
					this.$emit("input", this.$refs.input.value);
                }       
        }
	},
	watch: {
		// reset validity if the value is updated
		value: function(newValue) {
			this.valid = null;
			// remove local messages
			this.messages.splice(0);
			if (!this.blurred) {
				this.localValue = this.formatter && this.value != null ? this.formatter(this.value) : this.value;
			}
			else {
				this.localValue = this.masker && this.value != null ? this.masker(this.value) : this.value;
			}
			// if we have a range, calculate the offset, if we do it without the timeout, it is always one value too late :(
			if (this.type == "range") {
				var self = this;
				setTimeout(function() {
					self.calculateOffset(self.value);
				}, 1);
			}
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



