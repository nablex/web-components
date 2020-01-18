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
			var position = this.position == "left" ? "left" : "right";
			this.$el.setAttribute("id", "n-sidebar-" + position + "-instance");
			this.parentNode = this.$el.parentNode;
			if (this.$root.$el != this.parentNode) {
				this.$root.$el.appendChild(this.$el);
			}
			if (this.inline) {
				document.body.setAttribute("has-sidebar-" + position, "true");
			}
		}
		this.$el.$$close = this.close;
		this.closeOther();
	},
	methods: {
		closeOther: function() {
			var position = this.position == "left" ? "left" : "right";
			// by default we just want one open, or they would pop over each other
			var existing = document.querySelectorAll("#n-sidebar-" + position + "-instance");
			var self = this;
			existing.forEach(function(x) {
				if (x != self.$el) {
					x.$$close();
				}
			});
		},
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
				if (this.parentNode && this.$el.parentNode != this.parentNode) {
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
