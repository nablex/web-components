Vue.component("n-input-combo", {
	props: {
		value: {
			required: true
		},
		labels: {
			type: Array,
			required: false
		},
		initialLabel: {
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
		// used to extract the actual value from the suggested items
		extracter: {
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
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		name: {
			type: String,
			required: false
		},
		autoselectSingle: {
			type: Boolean,
			required: false
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
			updatingContent: false,
			actualValue: null
		}
	},
	created: function() {
		if (this.labels) {
			this.label = this.initialLabel && this.labels.indexOf(this.initialLabel) >= 0 ? this.initialLabel : this.labels[0];
		}
		if (this.filter && !this.disabled) {
			this.filterItems(this.content, this.label, null, true);
		}
		else if (this.items) {
			if (this.items.then) {
				var self = this;
				this.items.then(function(items) {
					nabu.utils.arrays.merge(self.values, items);
					self.synchronizeValue(true);
				});
			}
			else {
				nabu.utils.arrays.merge(this.values, this.items);
				this.synchronizeValue(true);
			}
		}
		// do a synchronization if we do not have an extracter, we are not dependend on values being loaded then
		if (!this.extracter) {
			this.synchronizeValue(true);
		}
	},
	methods: {
		synchronizeValue: function(initial) {
			if (this.value) {
				if (this.extracter) {
					// only look for a match if we haven't found one already
					// normally in the initial state, a match should be found but once we start filtering it might disappear
					// at that point we can't match it anymore even though it is a "valid" value
					if (!this.actualValue || this.extracter(this.actualValue) != this.value) {
						for (var i = 0; i < this.values.length; i++) {
							if (this.extracter(this.values[i]) == this.value) {
								this.actualValue = this.values[i];
								break;
							}
						}
					}
				}
				else {
					this.actualValue = this.value;
				}
			}
			else {
				this.actualValue = null;
			}
			// only update the content if this is the initial setting
			// afterwards people just type and it remains
			if (initial) {
				this.content = this.actualValue ? (this.formatter ? this.formatter(this.actualValue) : this.actualValue) : null;
			}
		},
		clear: function() {
			this.content = null;
			if (this.filter) {
				this.filterItems(this.content, this.label);
			}
		},
		filterItems: function(content, label, match, initial) {
			var result = this.filter(content, label);
			this.values.splice(0, this.values.length);
			if (result instanceof Array) {
				nabu.utils.arrays.merge(this.values, result);
				this.synchronizeValue(initial);
				if (match) {
					this.checkForMatch(content);
				}
				if (this.value == null && this.autoselectSingle && result.length == 1) {
					this.updateValue(result[0]);
				}
			}
			else if (result.then) {
				var self = this;
				result.then(function(results) {
					self.values.splice(0, self.values.length);
					// if it is not an array, find the first array child, rest service returns always have a singular root
					if (!(results instanceof Array)) {
						for (var key in results) {
							if (results[key] instanceof Array) {
								results = results[key];
								break;
							}
						}
					}
					if (results && results.length) {
						nabu.utils.arrays.merge(self.values, results);
					}
					self.synchronizeValue(initial);
					if (match) {
						self.checkForMatch(content);
					}
					if (this.value == null && this.autoselectSingle && results != null && results.length == 1) {
						this.updateValue(results[0]);
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
				this.$emit("input", this.extracter && match ? this.extracter(match) : match, this.label);
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
						self.filterItems(match || !value ? null : value, self.label, !match);
					}, this.timeout);
				}
				else {
					this.filterItems(match || !value ? null : value, this.label, !match);
				}
			 }
		},
		// you select something from the dropdown
		updateValue: function(value) {
			this.updatingContent = true;
			this.$emit("input", this.extracter && value ? this.extracter(value) : value, this.label);
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
			if (newValue && newValue.then) {
				var self = this;
				newValue.then(function(items) {
					self.values.splice(0, self.values.length);
					nabu.utils.arrays.merge(self.values, items);
					self.synchronizeValue(true);
				});
			}
			else {
				this.values.splice(0, this.values.length);
				if (newValue) {
					nabu.utils.arrays.merge(this.values, newValue);
					this.synchronizeValue(true);
				}
			}
		},
		value: function(newValue, oldValue) {
			if (!this.updatingContent) {
				this.synchronizeValue(true);
			}
			else {
				this.updatingContent = false;
			}
		},
		disabled: function(newValue, oldValue) {
			if (newValue == false && oldValue == true) {
				if (this.filter) {
					this.filterItems(this.content, this.label);
				}
			}
		},
		labels: function(newValue) {
			// if the current label is no longer valid, change it
			if (this.label && newValue.indexOf(this.label) < 0) {
				this.label = newValue.length ? newValue[0] : null;
				this.filterItems(this.content, this.label);
			}
		}
	}
});
