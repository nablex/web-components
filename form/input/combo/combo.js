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
		validate: function(soft) {
			this.messages.splice(0, this.messages.length);
			var messages = nabu.utils.schema.json.validate(this.definition, this.value, this.mandatory);
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
		updateValue: function(value, label) {
			this.$emit("input", value, label);
		},
		clear: function() {
			this.$refs.combo.clear();
		}
	}
});
