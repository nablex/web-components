Vue.component("n-paging", {
	props: {
		value: {
			type: Number,
			required: false,
			default: 0
		},
		amount: {
			type: Number,
			required: false,
			default: 7
		},
		total: {
			type: Number,
			required: false,
			default: 1
		},
		load: {
			type: Function,
			required :false
		},
		arrows: {
			type: Boolean,
			required: false,
			default: false
		},
		// whether or not to perform an initial load
		initialize: {
			type: Boolean,
			required: false,
			default: true
		},
		buttonClasses: {
			type: Array,
			required: false
		},
		formClasses: {
			type: Array,
			required: false,
			default: function() {
				return "is-color-background is-spacing-large is-shadow-xsmall is-variant-vertical".split(" ");
			}
		},
		showEmpty: {
			type: Boolean,
			required: false
		}
	},
	template: "#n-paging",
	data: function() {
		return {
			loading: false,
			page: 0
		}
	},
	mounted: function() {
		this.page = this.value;
		if (this.load && this.initialize) {
			this.load(this.page);
		}
	},
	computed: {
		buttons: function() {
			var buttons = [];
			// we substract the current page and the inevitable first and last entries
			var surrounding = (this.amount - 2 - 1) / 2;
			if (this.page >= surrounding) {
				buttons.push(1);
				if (surrounding > 2 && this.page > surrounding) {
					buttons.push(2);
				}
				if (this.page >= surrounding + 1) {
					buttons.push(null);
				}
			}
			for (var i = Math.max(this.page - surrounding + 1, 0); i < Math.min(this.page + surrounding, this.total); i++) {
				buttons.push(i + 1);
			}
			if (this.page + surrounding < this.total) {
				if (this.page < this.total - surrounding - 1) {
					buttons.push(null);
				}
				if (surrounding > 2 && this.page < this.total - surrounding - 1) {
					buttons.push(this.total - 1);
				}
				buttons.push(this.total);
			}
			// at least push the first one if we want _something_
			if (buttons.length == 0 && this.showEmpty) {
				buttons.push(1);
			}
			return buttons;
		}
	},
	methods: {
		update: function(page) {
			this.$emit("input", page);
			if (this.load) {
				var self = this;
				self.loading = true;
				this.load(page).then(function() {
					self.page = page;
					self.loading = false;
				}, function() {
					self.loading = false;
				});
			}
			else {
				this.page = page;
			}
		},
		set: function(page) {
			this.page = page;
		},
		promptPage: function() {
			var self = this;
			this.$prompt(function() {
				var component = Vue.extend({ template: "#n-paging-prompt" });
				return new component({data: { page: null, formClasses: self.formClasses }});
			}).then(function(page) {
				page = parseInt(page) - 1;
				page = Math.max(0, page);
				page = Math.min(self.total, page);
				self.update(page);
			});
		}
	},
	watch: {
		value: function(newValue) {
			this.page = newValue;
		}
	}
});