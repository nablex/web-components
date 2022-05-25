Vue.component("n-form", {
	props: {
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		mode: {
			type: String,
			required: false
		},
		// alternative code mappings for validations
		codes: {
			type: Object,
			required: false
		},
		contentClass: {
			type: String,
			required: false
		}
	},
	template: "#n-form",
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
			var messages = nabu.utils.vue.form.validateChildren(this, soft);
			var self = this;
			var map = function(validations) {
				if (self.codes) {
					validations.forEach(function(x) {
						if (x.code && self.codes[x.code]) {
							Vue.set(x, "title", self.codes[x.code]);
						}
					});
				}
			}
			map(messages);
			if (messages.then) {
				messages.then(function() {
					map(messages);
				})
			}
			return messages;
		}
	}
});
