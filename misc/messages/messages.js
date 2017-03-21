Vue.component("n-messages", {
	props: {
		messages: {
			type: Array,
			required: true
		}
	},
	template: "#n-messages",
	methods: {
		format: function(text, values, context) {
			if (context) {
				for (var i = 0; i < context.length; i++) {
					text = text.replace("{context[" + i + "]}", context[i]);
				}
			}
			if (values) {
				for (key in values) {
					text = text.replace("{" + key + "}", values[key]);
				}
			}
			return text;
		}
	}
});