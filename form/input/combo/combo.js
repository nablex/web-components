Vue.component("n-form-combo", {
	props: {
		value: {
			required: true
		},
		label: {
			type: String,
			required: false
		},
		labels: {
			type: Array,
			required: false
		},
		initialLabel: {
			required: false
		},
		filter: {
			type: Function,
			required: false
		},
		// used to format the value into the input once selected from the dropdown
		formatter: {
			type: Function,
			required: false
		},
		// used to extract the actual value from the suggested items
		extracter: {
			type: Function,
			required: false
		},
		// used to resolve an extracted value into a valid item usually returned by filter
		resolver: {
			type: Function,
			required: false
		},
		required: {
			type: Boolean,
			required: false,
			// explicitly set default value to null, otherwise vue will make it false which we can't distinguish from "not set"
			default: null
		},
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		edit: {
			type: Boolean,
			required: false,
			default: true
		},
		items: {
			required: false
		},
		nillable: {
			type: Boolean,
			default: true
		},
		timeout: {
			type: Number,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		autoclose: {
			type: Boolean,
			required: false,
			default: true
		},
		disabled: {
			type: Boolean,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		autocomplete: {
			type: String,
			required: false
		},
		autoselectSingle: {
			type: Boolean,
			required: false
		},
		caseInsensitive: {
			type: Boolean,
			required: false,
			default: false
		},		
		descriptionIcon: {
			type: String,
			required: false
		},
		description: {
			type: String,
			required: false
		},
		descriptionType: {
			type: String,
			default: "after"
		},
		info: {
			type: String,
			required: false
		},
		after: {
			type: String,
			required: false
		},
		before: {
			type: String,
			required: false
		},
		validator: {
			type: Function,
			required: false
		},
		allowTyping: {
			type: Boolean,
			default: true
		}
	},
	template: "#n-form-combo",
	data: function() {
		return {
			valid: null,
			messages: [],
			valueLabel: null
		}
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
		refilter: function() {
			this.$refs.combo.refilter();
		},
		validate: function(soft) {
			this.messages.splice(0);
			var messages = nabu.utils.schema.json.validate(this.definition, this.value, this.mandatory);
			// if we have an error that the value is required but you did type something, you typed something invalid, let's reflect that in the message title
			var requiredMessage = messages.filter(function(x) { return x.code == "required" })[0];
			if (requiredMessage && this.$refs && this.$refs.combo && this.$refs.combo.content) {
				requiredMessage.title = "%{validation:The value you entered is invalid}";
				requiredMessage.actual = this.$refs.combo.content;
			}
			for (var i = 0; i < messages.length; i++) {
				Object.defineProperty(messages[i], 'component', {
					value: this,
					enumerable: false
				});
			}
			// allow for custom validation
			messages = nabu.utils.vue.form.validateCustom(messages, this.value, this.validator, this);
			
			var self = this;
			messages.then(function(validations) {
				var hardMessages = messages.filter(function(x) { return !x.soft });
				// if we are doing a soft validation and all messages were soft, set valid to unknown
				if (soft && hardMessages.length == 0 && (messages.length > 0 || self.value == null) && (self.valid == null || self.value == null)) {
					self.valid = null;
				}
				else {
					self.valid = messages.length == 0;
					nabu.utils.arrays.merge(self.messages, nabu.utils.vue.form.localMessages(self, messages));
				}
			});
			return messages;
		},
		updateValue: function(value, label) {
			this.$emit("input", value, label);
		},
		clear: function() {
			this.$refs.combo.clear();
		}
	},
	watch: {
		value: function() {
			this.messages.splice(0);
			this.valid = null;
		}
	}
});

