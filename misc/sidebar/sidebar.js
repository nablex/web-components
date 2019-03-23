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
		}
	},
	ready: function() {
		if (this.popout) {
			this.parentNode = this.$el.parentNode;
			this.$root.$el.appendChild(this.$el);
		}
	},
	methods: {
		close: function() {
			if (this.popout) {
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