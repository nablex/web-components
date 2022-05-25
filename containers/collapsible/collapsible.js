if (!nabu) { var nabu = {}; }
if (!nabu.components) { nabu.components = {}; }

nabu.components.collapsible = Vue.component("n-collapsible", {
	props: {
		title: {
			type: String,
			required: true
		},
		load: {
			type: Function,
			required: false
		},
		before: {
			type: String,
			required: false
		},
		after: {
			type: String,
			required: false
		},
		startOpen: {
			type: Boolean,
			required: false
		},
		onlyOneOpen: {
			type: Boolean,
			required: false
		},
		contentClass: {
			type: String,
			required: false
		}
	},
	template: "#n-collapsible",
	data: function () {
		return {
			show: false,
			loading: false,
			toggleable: true
		}
	},
	created: function() {
		if (this.startOpen) {
			this.show = true;
		}
	},
	methods: {
		toggle: function() {
			var self = this;
			var closeRest = function() {
				if (self.onlyOneOpen) {
					self.$parent.$children.forEach(function(child) {
						if (child.toggle && child.$el.classList.contains("is-collapsible"))	{
							if (child.show) {
								child.toggle();
							}
						}
					});
				}
			}
			if (this.toggleable) {
				if (!this.show) {
					if (this.load) {
						this.loading = true;
						var self = this;
						this.load().then(function() {
							closeRest();
							self.show = true;
							self.loading = false;
							self.$emit("show", self);
						}, function() {
							self.show = false;
							self.loading = false;
							self.$emit("hide", self);
						});
					}
					else {
						closeRest();
						this.show = true;
						this.$emit("show", this);
					}
				}
				else {
					this.show = false;
					this.$emit("hide", this);
				}
			}
		}
	}
});
