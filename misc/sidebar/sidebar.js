Vue.component("n-sidebar", {
	template: "#n-sidebar",
	ready: function() {
		this.parentNode = this.$el.parentNode;
		this.$root.$el.appendChild(this.$el);
	},
	methods: {
		close: function() {
			if (this.$el.parentNode != this.parentNode) {
				this.parentNode.appendChild(this.$el);
			}
			this.$emit('close');
		}
	}
});