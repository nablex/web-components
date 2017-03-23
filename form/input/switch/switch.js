Vue.component("n-form-switch", {
	props: {
		value: {
			required: true
		}
	},
	template: "#n-form-switch",
	data: function() {
		return {
			internal: null
		};
	},
	created: function() {
		this.internal = this.value;
	}
});