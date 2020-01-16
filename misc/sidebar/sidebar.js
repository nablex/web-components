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
				if (this.position == "left") {
					document.body.setAttribute("has-sidebar-left", "true");
				}
				else {
					document.body.setAttribute("has-sidebar-right", "true");
				}
			}
		}
	},
	methods: {
		close: function() {
			if (this.popout) {
				if (this.inline) {
					if (this.position == "left") {
						document.body.removeAttribute("has-sidebar-left");
					}
					else {
						document.body.removeAttribute("has-sidebar-right");
					}
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
