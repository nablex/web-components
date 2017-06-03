if (!nabu) { var nabu = {}; }
if (!nabu.components) { nabu.components = {}; }

nabu.components.secret = Vue.component("n-secret", {
	props: {
		content: {
			type: String,
			required: true
		}
	},
	template: "#n-secret",
	data: function () {
		return {
			show: false
		}
	},
	computed: {
		secretContent: function() {
			return this.content.replace(/./g, "*");
		}
	}
});