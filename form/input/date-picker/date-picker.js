Vue.component("n-form-date-picker", {
	template: "#n-form-date-picker",
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
		disabled: {
			type: Boolean,
			required: false
		},
		validator: {
			type: Function,
			required: false
		},
		format: {
			type: String,
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
		// a date or something that can be thrown at the Date constructor
		notBefore: {
			required: false
		},
		notAfter: {
			required: false
		},
		minimumOffset: {
			type: Number,
			required: false
		},
		maximumOffset: {
			type: Number,
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
		default: {
			required: false
		},
		fields: {
			type: Array,
			required: false,
			default: function() { return ["year", "month", "day"]; }
		},
		description: {
			type: String,
			required: false
		}
	},
	data: function() {
		return {
			result: {
				year: null,
				month: null,
				day: null
			},
			messages: [],
			valid: null
		}
	},
	created: function() {
		if (!this.value && this.default) {
			this.$emit("input", this.default);
		}
		if (this.value) {
			this.result.year = this.fields.indexOf("year") >= 0 ? this.value.getFullYear() : null;
			this.result.month = this.fields.indexOf("month") >= 0 ? this.value.getMonth() + 1 : null;
			this.result.day = this.fields.indexOf("day") >= 0 ? this.value.getDate() : null;
		}
	},
	computed: {
		self: function() {
			return this;
		},
		definition: function() {
			return nabu.utils.vue.form.definition(this);
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	methods: {
		validate: function(soft) {
			this.messages.splice(0, this.messages.length);
			var messages = nabu.utils.schema.json.validate(this.definition, this.value, this.mandatory);
			for (var i = 0; i < messages.length; i++) {
				messages[i].component = this;
			}
			if (this.validator != null) {
				var additional = this.validator(this.value);
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
		editable: function(field) {
			return field == "year"
				|| (field == "month" && (this.result.year != null || this.fields.indexOf("year") < 0))
				|| (field == "day" && (this.result.year != null || this.fields.indexOf("year") < 0) && (this.result.month != null || this.fields.indexOf("month") < 0));
		},
		listField: function(field, value) {
			var from = null;
			if (this.notBefore != null) {
				from = this.notBefore instanceof Date ? this.notBefore : new Date(this.notBefore);
			}
			else if (this.maximumOffset != null && this.maximumOffset < 0) {
				from = new Date(new Date().getTime() + (this.maximumOffset * 1000 * 60 * 60 * 24));
			}
			else if (this.minimumOffset != null && this.minimumOffset > 0) {
				from = new Date(new Date().getTime() + (this.minimumOffset * 1000 * 60 * 60 * 24));
			}
			else {
				from = new Date("1900-01-01T00:00:00Z");
			}
			var to = null;
			if (this.notAfter != null) {
				to = this.notAfter instanceof Date ? this.notAfter : new Date(this.notAfter);
			}
			else if (this.maximumOffset != null && this.maximumOffset > 0) {
				to = new Date(new Date().getTime() + (this.maximumOffset * 1000 * 60 * 60 * 24));
			}
			else if (this.minimumOffset != null && this.minimumOffset < 0) {
				to = new Date(new Date().getTime() + (this.minimumOffset * 1000 * 60 * 60 * 24));
			}
			else {
				to = new Date("2075-01-01T00:00:00Z");
			}
			var options = [];
			// at some point we might want to add labels (e.g. month formatting)
			if (field == "year") {
				for (var i = from.getFullYear(); i <= to.getFullYear(); i++) {
					if (value == null || this.formatField(field, i).toLowerCase().indexOf(value.toLowerCase()) >= 0) {
						options.push(i);
					}
				}
				options.reverse();
			}
			else if (field == "month") {
				for (var i = 1; i <= 12; i++) {
					if (this.result.year != null) {
						// we want the last of the month, and months start at 0, so i is already +1
						if (new Date(this.result.year, i, -1).getTime() < from.getTime()) {
							continue;
						}
						// check that the first of the month is still allowed by the to
						else if (new Date(this.result.year, i - 1, 1).getTime() > to.getTime()) {
							continue;
						}
					}
					if (value == null || this.formatField(field, i).toLowerCase().indexOf(value.toLowerCase()) >= 0) {
						options.push(i);
					}
				}
			}
			else if (field == "day") {
				for (var i = 1; i <= 31; i++) {
					if (this.result.year != null && this.result.month != null) {
						var date = new Date(this.result.year, this.result.month - 1, i);
						// that day does not exist in this month
						if (date.getMonth() != this.result.month - 1) {
							continue;
						}
						else if (date.getTime() < from.getTime()) {
							continue;
						}
						// check that the first of the month is still allowed by the to
						else if (date.getTime() > to.getTime()) {
							continue;
						}
					}
					if (value == null || this.formatField(field, i).toLowerCase().indexOf(value.toLowerCase()) >= 0) {
						options.push(i);
					}
				}
			}
			return options;
		},
		formatField: function(field, value) {
			if (value == null) {
				return value;
			}
			if (field == "year") {
				return "" + value;
			}
			else if (field == "month") {
				return nabu.utils.dates.months()[value - 1];
			}
			else if (field == "day") {
				return parseInt(value) < 10 ? "0" + value : "" + value;
			}
			return "" + value;
		},
		updateField: function(field, value) {
			if (value == "") {
				value = null;
			}
			var self = this;
			this.result[field] = value;
			// validate the month and day
			if (field == "year") {
				if (this.result.month != null) {
					var options = this.listField("month");
					if (options.indexOf(this.result.month) < 0) {
						this.result.month = null;
						this.result.day = null;
					}
				}
				// always recalculate the suggestions
				// it's an array because the ref is defined in a for loop
				this.$refs.month[0].refilter();
				
				if (this.result.year != null && this.fields.indexOf("month") >= 0) {
					setTimeout(function() {
						self.$refs.month[0].$el.querySelector("input").focus();
					}, 1);
				}
			}
			else if (field == "month") {
				if (this.result.month != null && this.fields.indexOf("day") >= 0) {
					setTimeout(function() {
						self.$refs.day[0].$el.querySelector("input").focus();
					}, 1);
				}
			}
			if (field == "year" || field == "month") {
				if (this.result.day != null) {
					var options = this.listField("day");
					if (options.indexOf(this.result.day) < 0) {
						this.result.day = null;
					}
				}
				this.$refs.day[0].refilter();
			}
			// we want to avoid timezone issues
			var string = null;
			if (this.result.year != null) {
				string = this.result.year;
				string += "-" + (this.result.month == null ? "01" : (this.result.month < 10 ? "0" : "") + this.result.month);
				string += "-" + (this.result.day == null ? "01" : (this.result.day < 10 ? "0" : "") + this.result.day);
				string +="T00:00:00Z";
			}
			console.log("emitting", string);
			this.$emit("input", string == null ? null : new Date(string));
		}
	}
});