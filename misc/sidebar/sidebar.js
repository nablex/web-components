Vue.component("n-sidebar", {
	template: "#n-sidebar",
	props: {
		popout: {
			type: Boolean,
			required: false,
			default: true
		},
		autocloseable: {
			type: Boolean,
			required: false,
			default: true
		},
		inline: {
			type: Boolean,
			required: false,
			default: false
		},
		position: {
			type: String,
			required: false,
			default: "right"
		}
	},
	ready: function() {
		if (this.popout) {
			this.parentNode = this.$el.parentNode;
			this.$root.$el.appendChild(this.$el);
			if (this.inline) {
				document.body.setAttribute("has-sidebar", this.position == "left" ? "left" : "right");
			}
		}
	},
	methods: {
		close: function() {
			if (this.popout) {
				if (this.inline) {
					document.body.removeAttribute("has-sidebar");
				}
				if (this.$el.parentNode != this.parentNode) {
					this.parentNode.appendChild(this.$el);
				}
			}
			this.$emit('close');
		},
		autoClose: function() {
			if (this.autocloseable) {
				this.close();
			}
		}
	}
});
