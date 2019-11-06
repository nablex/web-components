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
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	methods: {
		validate: function() {
			var messages = nabu.utils.schema.json.validate(this.definition, this.value, this.mandatory);
			for (var i = 0; i < messages.length; i++) {
				messages[i].component = this;
			}
			if (this.validator) {
				var additional = this.validator(this.value);
				if (additional && additional.length) {
					for (var i = 0; i < additional.length; i++) {
						additional[i].component = this;
						if (typeof(additional[i].context) == "undefined") {
							additional[i].context = [];
						}
						messages.push(additional[i]);
					}
				}
			}
			this.valid = messages.length == 0;
			return messages;
		}, 
		select: function(option) {
			if (!this.disabled && this.edit) {
				this.$emit("input", this.extracter ? this.extracter(option) : option);
				// we don't know if it's valid at this point
				this.valid = null;
			}
		}
	}
});
