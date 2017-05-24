Vue.component("n-info", {
	props: {
		autoClose: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	template: "#n-info",
	data: function() {
		return {
			showing: false
		}
	}
});