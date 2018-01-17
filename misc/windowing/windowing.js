Vue.component("n-windowing", {
	props: {
		value: {
			type: Number,
			required: false,
			default: 0
		},
		hasNext: {
			type: Boolean,
			required: false,
			default: false
		},
		load: {
			type: Function,
			required :false
		},
		// whether or not to perform an initial load
		initialize: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	template: "#n-windowing",
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
	methods: {
		update: function(page) {
			if (this.load) {
				var self = this;
				self.loading = true;
				this.load(page).then(function() {
					self.$emit("input", page);
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
		}
	},
	watch: {
		value: function(newValue) {
			this.page = newValue;
		}
	}
});