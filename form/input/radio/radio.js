Vue.component("n-form-radio", {
	props: {
		value: {
			required: true
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
		label: {
			type: String,
			required: false
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
		items: {
			type: Array,
			required: true
		},
		validator: {
			type: Function,
			required: false
		},
		// we have a list of items, this is the display label
		formatter: {
			type: Function,
			required: false
		},
		// we have a list of items, this is how we extract the value
		extracter: {
			type: Function,
			required: false
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
		}		
	},
	template: "#n-form-radio",
	data: function() {
		return {
			messages: [],
			valid: null,
			actualValue: null
		};
	},
	created: function() {
		// if we received an extracter, the current value is an extract from one of the items
		if (this.extracter && this.value) {
			var self = this;
			this.actualValue = this.items.filter(function(x) { return self.extracter(x) == self.value })[0];
		}
		else {
			this.actualValue = this.value;
		}
	},
	computed: {
		definition: function() {
			return nabu.utils.vue.form.definition(this);
		},
		mandatory: function() {
			console.log("computed mandatory:", nabu.utils.vue.form.mandatory(this));
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	methods: {
		validate: function(soft) {
			console.log("validate messages:", messages);
			this.messages.splice(0, this.messages.length);
			var messages = nabu.utils.schema.json.validate(this.definition, this.value, this.mandatory);
			// if we have an error that the value is required but you did type something, you typed something invalid, let's reflect that in the message title
			var requiredMessage = messages.filter(function(x) { return x.code == "required" })[0];
			if (requiredMessage && this.$refs && this.$refs.combo && this.$refs.combo.content) {
				requiredMessage.title = "%{validation:Please choose a value}";
				requiredMessage.actual = this.$refs.combo.content;
			}
			for (var i = 0; i < messages.length; i++) {
				messages[i].component = this;
			}
			var hardMessages = messages.filter(function(x) { return !x.soft });
			// if we are doing a soft validation and all messages were soft, set valid to unknown
			if (soft && hardMessages.length == 0 && (messages.length > 0 || this.value == null) && (this.valid == null || this.value == null)) {
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
		select: function(option) {
			if (!this.disabled && this.edit) {
				this.$emit("input", this.extracter ? this.extracter(option) : option);
				// we don't know if it's valid at this point
				this.valid = null;
				this.messages.splice(0);
			}
		}
	}
});
