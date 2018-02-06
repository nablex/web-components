Vue.component("n-input-combo", {
	props: {
		value: {
			required: true
		},
		labels: {
			type: Array,
			required: false
		},
		filter: {
			type: Function,
			required: false
		},
		// used to format the value into the input once selected from the dropdown
		formatter: {
			type: Function,
			required: false
		},
		items: {
			required: false
		},
		nillable: {
			type: Boolean,
			default: true
		},
		timeout: {
			type: Number,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		autoclose: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	template: "#n-input-combo",
	data: function() {
		return {
			label: null,
			showLabels: false,
			showValues: false,
			values: [],
			content: null,
			timer: null,
			updatingContent: false
		}
	},
	created: function() {
		if (this.labels) {
			this.label = this.labels[0];
		}
		if (this.filter) {
			this.filterItems(this.content, this.label);
		}
		else if (this.items) {
			nabu.utils.arrays.merge(this.values, this.items);
		}
		this.content = this.value != null && this.formatter ? this.formatter(this.value) : this.value;
	},
	methods: {
		clear: function() {
			this.content = null;
			this.filterItems(this.content, this.label);
		},
		filterItems: function(content, label, match) {
			var result = this.filter(content, label);
			this.values.splice(0, this.values.length);
			if (result instanceof Array) {
				nabu.utils.arrays.merge(this.values, result);
				if (match) {
					this.checkForMatch(content);
				}
			}
			else if (result.then) {
				var self = this;
				result.then(function(results) {
					self.values.splice(0, self.values.length);
					if (!(results instanceof Array)) {
						for (var key in results) {
							if (results[key] instanceof Array) {
								results = results[key];
								break;
							}
						}
					}
					nabu.utils.arrays.merge(self.values, results);
					if (match) {
						self.checkForMatch(content);
					}
				});
			}
		},
		checkForMatch: function(value) {
			var match = null;
			for (var i = 0; i < this.values.length; i++) {
				var formatted = this.values[i] != null && this.formatter ? this.formatter(this.values[i]) : this.values[i];
				if (formatted == value) {
					match = this.values[i];
					break;
				}
			}
			// only update the value if it matches a value in the dropdown list 
			if (match != null || (!value && this.nillable)) {
				this.updatingContent = true;
				this.$emit("input", match);
			}
			// if it is nillable and the current bound value has some value, reset it to null
			else if (this.nillable && this.value) {
				this.updatingContent = true;
				this.$emit("input", null);
			}
			return match;
		},
		updateContent: function(value) {
			var match = this.checkForMatch(value);

			// try to finetune the results
			if (this.filter) {
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
				if (this.timeout) {
					var self = this;
					this.timer = setTimeout(function() {
						self.filterItems(match || !value ? null : value, self.label, true);
					}, this.timeout);
				}
				else {
					this.filterItems(match || !value ? null : value, this.label, true);
				}
			 }
		},
		// you select something from the dropdown
		updateValue: function(value) {
			this.$emit("input", value);
			this.content = value != null && this.formatter ? this.formatter(value) : value;
			// reset the results to match everything once you have selected something
			if (this.filter) {
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
				if (this.timeout) {
					var self = this;
					this.timer = setTimeout(function() {
						self.filterItems(null, self.label, false);
					}, this.timeout);
				}
				else {
					this.filterItems(null, this.label, false);
				}
			 }
		},
		selectLabel: function(label) {
			this.content = null;
			if (this.filter) {
				this.filterItems(this.content, label);
			}
			this.label = label;
		}
	},
	watch: {
		items: function(newValue) {
			this.values.splice(0, this.values.length);
			if (newValue) {
				nabu.utils.arrays.merge(this.values, newValue);
			}
		},
		value: function(newValue, oldValue) {
			if (!this.updatingContent) {
				this.content = this.value != null && this.formatter ? this.formatter(this.value) : this.value;
			}
			else {
				this.updatingContent = false;
			}
		}
	}
});