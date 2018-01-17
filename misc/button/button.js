Vue.component("n-button", {
	template: "#n-button",
	props: {
		icon: {
			type: String,
			required: false
		},
		text: {
			type: String,
			required: false
		},
		type: {
			type: String,
			required: false
		}
	}
});