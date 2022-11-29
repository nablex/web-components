Vue.component("n-form-checkbox-list-configure", {
	template: "#n-form-checkbox-list-configure",
});
Vue.component("n-form-checkbox-list", {
	template: "#n-form-checkbox-list",
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
	computed: {
		definition: function() {
			return nabu.utils.vue.form.definition(this);
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	data: function() {
		return {
			messages: [],
			valid: null,
			actualValue: null,
			chosen: false,
			// corresponding labels
			labels: []
		};
	},
	mounted: function() {
		if (!this.value || !(this.value instanceof Array)) {
			this.$emit("input", []);	
		}
		// if we already have items, let's fill up the labels
		else if (this.value.length) {
			var self = this;
			this.value.forEach(function(x) {
				var index;
				if (!self.extracter) {
					index = self.items.indexOf(x);
				}
				else {
					self.items.forEach(function(item, i) {
						if (self.extracter(item) == x) {
							index = i;
						}
					});
				}
				self.labels.push(index >= 0 ? (self.formatter ? self.formatter(self.value[index]) : self.value[index]) : self.value[index]);
			})
		}
	},
	methods: {
		isChecked: function(item) {
			var value = this.extracter ? this.extracter(item) : item;
			return this.value && this.value.indexOf(value) >= 0;
		},
		toggle: function(item) {
			var value = this.extracter ? this.extracter(item) : item;
			var index = this.value.indexOf(value);
			if (index >= 0) {
				this.value.splice(index, 1);
				this.labels.splice(index, 1);
			}
			else {
				this.value.push(value);
				this.labels.push(this.formatter ? this.formatter(value ) : value);
			}
			//this.$emit("input", this.value, this.labels);
		},
		validate: function(soft) {
			this.messages.splice(0, this.messages.length);
			var messages = nabu.utils.schema.json.validate(this.definition, this.value, this.mandatory);
			
			var existingRequired = messages.filter(function(x) { return x.code == "required" })[0];
			if (existingRequired) {
				existingRequired.title = "%{validation:You must choose at least one option}";
			}
			else if (this.mandatory && this.value.length == 0) {
				messages.push({
					code: "required",
					severity: "error",
					soft: true,
					priority: 0,
					title: "%{validation:You must choose at least one option}"
				});
			}
			
			for (var i = 0; i < messages.length; i++) {
				Object.defineProperty(messages[i], 'component', {
					value: this,
					enumerable: false
				});
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
		}
	}
});

window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		nabu.page.provide("page-form-list-input", { 
			component: "n-form-checkbox-list", 
			configure: "n-form-checkbox-list-configure", 
			name: "checkbox-list",
			namespace: "nabu.page"
		});
		nabu.page.provide("page-form-input", { 
			component: "n-form-checkbox-list", 
			configure: "n-form-checkbox-list-configure", 
			name: "checkbox-list",
			namespace: "nabu.page"
		});
	});
});
