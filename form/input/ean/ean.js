Vue.component("n-form-ean", {
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
		hide: {
			type: Boolean,
			required: false,
			default: null
		},
		disabled: {
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
		autoSelect: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: "#n-form-ean",
	data: function() {
		return {
			messages: [],
			valid: null,
			timer: null
		};
	},
	computed: {
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		},
		definition: function() {
			var definition = nabu.utils.vue.form.definition(this);
			definition.type = "number";
			return definition;
		}
	},
	methods: {
		focus: function($event) {
			this.$emit('focus', $event);
			if (this.autoSelect) {
				this.$refs.input.select();
			}
		},
		validate: function(soft) {
			var messages = [];
			
			var re = new RegExp("54[0-9]{16}");
			if (!re.test(this.value)) {
				messages.push({
					soft: false,
					severity: "error",
					code: "length",
					title: "%{validation:No valid Belgian EAN-code}",
					priority: 10,
					values: {
						actual: false,
						expected: true
					},
					context: []
				});				
			}
			// https://www.gs1.org/services/how-calculate-check-digit-manually
			var moduloCheck = function (value) {
				var calculation = (value.substring(0, 17).split(/\B/).reduce(function(sum, x, i) { 
					return sum + ((i % 2 == 0 ? 3 : 1) * x)
				}, 0))%10;
				var result = (calculation + parseInt(value.substring(17, 18)))%10;
				return result;
			}
			
			if (messages.length == 0 && moduloCheck(this.value) != 0) {
				messages.push({
					soft: false,
					severity: "error",
					code: "length",
					title: "%{validation:Verification check failed}",
					priority: 8,
					values: {
						actual: false,
						expected: true
					},
					context: []
				});				
			}
			
			this.messages.splice(0, this.messages.length);
			this.valid = messages.length == 0;
			nabu.utils.arrays.merge(this.messages, messages);
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
		}
	}
});
