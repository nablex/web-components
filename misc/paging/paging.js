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
			default: 9
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
		if (this.load) {
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
				if (surrounding >= 2 && this.page > surrounding) {
					buttons.push(2);
				}
				if (this.page > surrounding + 1) {
					buttons.push(null);
				}
			}
			for (var i = Math.max(this.page - surrounding + 1, 0); i < Math.min(this.page + surrounding, this.total); i++) {
				buttons.push(i + 1);
			}
			if (this.page + surrounding < this.total) {
				if (this.page < this.total - surrounding - 2) {
					buttons.push(null);
				}
				if (surrounding >= 2 && this.page < this.total - surrounding - 1) {
					buttons.push(this.total - 1);
				}
				buttons.push(this.total);
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
				return new component({data: { page: null }});
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
			this.page = value;
		}
	}
});