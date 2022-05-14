Vue.component("n-info", {
	props: {
		autoClose: {
			type: Boolean,
			required: false,
			default: true
		},
		icon: {
			type: String,
			required: false,
			default: "info-circle"
		}
	},
	template: "#n-info",
	data: function() {
		return {
			showing: false
		}
	}
});