Vue.component("icon", {
	template: "<span class='is-icon fa' :class=\"'fa-' + name\"/>",
	props: {
		name: {
			type: String,
			required: true
		}
	}
});