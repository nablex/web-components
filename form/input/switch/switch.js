Vue.component("n-form-switch", {
	props: {
		value: {
			required: true
		},
		item: {
			required: false
		},
		label: {
			type: String,
			required: false
		},
		edit: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	template: "#n-form-switch",
	data: function() {
		return {
			internal: null
		};
	},
	created: function() {
		this.internal = this.value instanceof Array ? this.value.indexOf(this.item) >= 0 : this.value;
	},
	methods: {
		updateValue: function(newValue) {
			this.$emit("input", newValue);
		}
	},
	watch: {
		value: function(newValue) {
			this.internal = newValue instanceof Array ? newValue.indexOf(this.item) >= 0 : newValue;
		}
	}
});
