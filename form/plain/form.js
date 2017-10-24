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
			return nabu.utils.vue.form.validateChildren(this, soft);
		}
	}
});