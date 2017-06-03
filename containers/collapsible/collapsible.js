if (!nabu) { var nabu = {}; }
if (!nabu.components) { nabu.components = {}; }

nabu.components.collapsible = Vue.component("n-collapsible", {
	props: {
		title: {
			type: String,
			required: true
		}
	},
	template: "#n-collapsible",
	data: function () {
		return {
			show: false
		}
	}
});