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
		},
		includeHours: {
			type: Boolean,
			required: false,
			default: false
		},
		includeMinutes: {
			type: Boolean,
			required: false,
			default: false
		},
		includeSeconds: {
			type: Boolean,
			required: false,
			default: false
		},
		timestamp: {
			type: Boolean,
			required: false,
			default: false
		},
		secondsTimestamp: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: "#n-form-date",
	data: function() {
		return {
			messages: [],
			valid: null,
			show: false,
			date: null,
			customizedSchema: null,
			lastParsed: null
		}
	},
	computed: {
		dynamicPattern: function() {
			// if we have a custom formatter, we have no pattern
			if (!this.formatter) {
				// the basic pattern
				var pattern = '^[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])';
				if (this.includeHours) {
					pattern += " [0-9]{2}";
					if (this.includeMinutes) {
						pattern += ":[0-9]{2}";
						if (this.includeSeconds) {
							pattern += ":[0-9]{2}";
						}
					}
				}
				pattern += "$";
				return pattern;
			}
		}
	},
	created: function() {
		if (this.schema) {
			// we are expecting timestamp, but this won't validate correctly because we are working with strings
			if (this.schema.type == "integer") {
				this.customizedSchema = nabu.utils.objects.deepClone(this.schema);
				this.customizedSchema.type = "string";
				this.customizedSchema.format = "date-time";
			}
			else {
				this.customizedSchema = this.schema;
			}
		}
		if (this.value instanceof Date || typeof(this.value) == "number") {
			this.date = this.formatValue(this.value);
		}
		else if (typeof(this.value) == "string") {
			var parsed = this.parser ? this.parser(this.value) : new Date(this.value);
			this.date = this.formatValue(parsed);
			// if it should not be stringified and we have a string, emit that
			if (!this.stringified) {
				this.$emit("input", parsed);
				this.$emit("label", this.value);
			}
		}
		else {
			this.date = this.value;
		}
	},
	methods: {
		formatValue: function(value) {
			var date = value instanceof Date ? value : new Date(this.secondsTimestamp ? value * 1000 : value);
			if (this.formatter) {
				date = this.formatter(date);
			}
			else {
				// because we depend on ISO string (which returns in UTC), we manually increment the date with the local timezone offset
				// presumably you don't want to edit the date in UTC but rather in local time
				date = new Date(
					date.getFullYear(),
					date.getMonth(),
					date.getDate(),
					date.getHours(),
					date.getMinutes() - date.getTimezoneOffset(),
					date.getSeconds(),
					0
				);
				if (this.includeHours && this.includeMinutes && this.includeSeconds) {
					date = date.toISOString().substring(0, 19).replace("T", " ");
				}
				else if (this.includeHours && this.includeMinutes) {
					date = date.toISOString().substring(0, 16).replace("T", " ");
				}
				else if (this.includeHours) {
					date = date.toISOString().substring(0, 13).replace("T", " ");
				}
				else {
					date = date.toISOString().substring(0, 10);
				}
			}
			return date;
		},
		// not used?
		updateValue: function(value) {
			if (this.stringify) {
				this.$emit("input", value);
			}
			else {
				this.$emit("input", this.parser ? this.parser(value) : new Date(value));
				this.$emit("label", value);
			}
		},
		isAvailable: function(date) {
			return this.allow == null || this.allow(date);
		},
		dateValidate: function(value) {
			var messages = [];
			if (this.validator) {
				var childMessages = this.validator(value);
				if (childMessages) {
					nabu.utils.arrays.merge(messages, childMessages);
				}
			}
			var parsed = value == null ? null
				: (this.parser ? this.parser(value) : new Date(value));
			// it is "a" value but not a parseable value
			if ((value != null && (parsed == null || !parsed.getTime))
					// or it is not a valid date
					|| (parsed != null && parsed.getTime && isNaN(parsed.getTime()))) {
				messages.push({
					severity: "error",
					code: "type",
					title: "%{validation:This is not a valid date: {actual}}",
					values: {
						actual: value,
						expected: "date"
					},
					context: []
				});
			}
			else if (parsed != null && parsed.getTime && !isNaN(parsed.getTime()) && !this.isAvailable(parsed)) {
				messages.push({
					severity: "error",
					code: "allowed",
					title: "%{validation:This date is not allowed: {actual}}",
					priority: 1,
					variables: {
						actual: value					
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
		},
		valueToDate: function(value) {
			if (this.parser) {
				return this.parser(value);
			}
			if (!this.includeHours) {
				value += " 00:00:00"
			}
			else if (!this.includeMinutes) {
				value += ":00:00"
			}
			else if (!this.includeSeconds) {
				value += ":00";
			}
			return new Date(value);
		}
	},
	watch: {
		date: function(newValue) {
			if (!newValue) {
				if (this.value) {
					this.$emit("input", null);
				}
			}
			else if (this.secondsTimestamp) {
				if (!this.value || this.formatValue(this.value) != newValue) {
					newValue = this.parser ? this.parser(newValue) : this.valueToDate(newValue);
					this.$emit("input", newValue.getTime() / 1000);
					this.$emit("label", this.formatValue(newValue));
				}
			}
			else if (this.timestamp) {
				if (!this.value || this.formatValue(this.value) != newValue) {
					newValue = this.parser ? this.parser(newValue) : this.valueToDate(newValue);
					this.$emit("input", newValue.getTime());
					this.$emit("label", this.formatValue(newValue));
				}
			}
			else if (this.stringify) {
				if (this.value != newValue) {
					newValue = this.formatValue(this.parser ? this.parser(newValue) : new Date(newValue))
					this.$emit("input", newValue);
					this.$emit("label", this.formatValue(newValue));
				}
			}
			else {
				newValue = this.parser ? this.parser(newValue) : this.valueToDate(newValue);
				if (newValue && newValue.getTime) {
					if (!this.value || newValue.getTime() != this.value.getTime()) {
						this.lastParsed = newValue;
						this.$emit("input", newValue);
						this.$emit("label", this.formatValue(newValue));
					}
				}
				// otherwise unset the value, at this point you are visually looking at something that is not a date
				// if we don't emit null, the old date will be retained (but invisible) making it for a weird interaction
				else {
					this.lastParsed = null;
					this.$emit("input", null);
					this.$emit("label", null);
				}
			}
		},
		value: function(newValue) {
			if (newValue instanceof Date || typeof(newValue) == "number") {
				var formatted = this.formatValue(newValue);
				// if we have parsed something in the past and it has now come back but for some reason it differs from the date itself, we might have a timezone issue
				if (this.lastParsed != null && this.lastParsed.getTime() == newValue.getTime() && formatted != this.date) {
					console.warn("Prevented a date loop potentially caused by a timezone difference", this.lastParsed, formatted, this.date);
				}
				else {
					this.date = formatted;
				}
				// unset the last parsed, we had a successful roundtrip
				// someone might want to alter it externally
				this.lastParsed = null;
			}
			else {
				this.date = newValue;
			}
		}
	}
});
