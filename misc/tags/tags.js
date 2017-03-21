Vue.component("n-tags", {
	props: {
		tags: {
			type: Array,
			required: true
		},
		formatter: {
			type: Function,
			required: false
		},
		removable: {
			type: Boolean,
			required: false
		}
	},
	template: "#n-tags",
	methods: {
		remove: function(tag) {
			this.tags.splice(this.tags.indexOf(tag), 1);
		},
		format: function(tag) {
			return this.formatter ? this.formatter(tag) : tag;
		}
	}
});