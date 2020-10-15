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
					var value = values[key];
					if (this.$services && this.$services.formatter && this.$services.formatter.number) {
						if (typeof(value) == "string" && value.match && value.match(/^[0-9.]+/)) {
							value = Number(value);
						}
						if (value instanceof Number || typeof(value) == "number") {
							value = this.$services.formatter.number(value);
						}
					}
					text = text.replace("{" + key + "}", value);
				}
			}
			return text;
		},
		highlight: function(message) {
			if (message.component && message.component.$el) {
				message.component.$el.setAttribute("highlight", "true");
			}
		},
		unhighlight: function(message) {
			if (message.component && message.component.$el) {
				message.component.$el.removeAttribute("highlight");
			}
		}
	}
});
