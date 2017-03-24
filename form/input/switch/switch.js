Vue.component("n-form-switch", {
	props: {
		value: {
			required: true
		},
		label: {
			type: String,
			required: false
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
	},
	watch: {
		value: function(newValue) {
			this.internal = newValue;
		}
	}
});