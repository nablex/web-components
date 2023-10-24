Vue.component("n-form-select", {
	template: "#n-form-select",
	props: {
		value: {
			required: true
		},
		name: {
			required: false,
		},
		// can be an array or a function
		// the function can return a promise
		items: {
			required: true
		},
		nillable: {
			type: Boolean,
			default: true
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
		// allows you to group items together
		grouper: {
			type: Function,
			required: false
		},
		// the input field itself has to be plain text (the formatter)
		// however, in the dropdowns (and in the future multiselect?) we can use html
		prettyFormatter: {
			type: Function,
			required: false
		},
		resolver: {
			type: Function,
			required: false
		},
		// the text to show when there are no hits
		emptyValue: {
			type: String,
			required: false
		},
		// the text to show while the hits are being calculated
		calculatingValue: {
			type: String,
			required: false
		},
		// the text to show to reset the current choice (value must not be null)
		resetValue: {
			type: String,
			required: false
		},
		// the text to show to select all
		selectAllValue: {
			type: String,
			required: false
		},
		useCheckbox: {
			type: Boolean,
			default: false
		},
		maxSize: {
			type: Number,
			default: 20
		}
	},
	data: function() {
		return {
			potentialValues: [],
			calculating: true,
			focused: false
		}
	},
	created: function() {
		this.load();
	},
	computed: {
		multiple: function() {
			return this.value instanceof Array;
		},
		groups: function() {
			var groups = {};
			if (this.grouper) {
				var self = this;
				this.potentialValues.forEach(function(single) {
					var group = self.grouper(single);
					if (group != null) {
						if (!groups[group]) {
							groups[group] = [];
						}
						groups[group].push(single);
					}
				})
			}
			return groups;
		},
		ungrouped: function() {
			var items = [];
			if (this.grouper) {
				this.potentialValues.forEach(function(single) {
					var group = self.grouper(single);
					if (group == null) {
						items.push(single);
					}
				});
			}
			else {
				nabu.utils.arrays.merge(items, this.potentialValues);
			}
			return items;
		},
		size: function() {
			if (this.focused && this.multiple) {
				return Math.max(1, Math.min(this.maxSize, this.potentialValues.length));
			}
			return 1;
		}
	},
	methods: {
		getExtracted: function(entry) {
			if (this.extracter) {
				entry = this.extracter(entry);
			}
			return entry;
		},
		getPrettyFormatted: function(entry) {
			if (this.prettyFormatter) {
				entry = this.prettyFormatter(entry);
			}
			else {
				return this.getFormatted(entry);
			}
		},
		getFormatted: function(entry) {
			if (this.formatter) {
				entry = this.formatter(entry);
			}
			return entry;
		},
		load: function() {
			var self = this;
			if (this.items instanceof Array) {
				nabu.utils.arrays.merge(this.potentialValues, this.items);
				self.calculating = false;
			}
			else if (this.items instanceof Function) {
				var result = this.items();
				if (result && result.then) {
					result.then(function(result) {
						if (result instanceof Array) {
							nabu.utils.arrays.merge(self.potentialValues, result);
						}
						self.calculating = false;
					})
				}
				else if (result instanceof Array) {
					nabu.utils.arrays.merge(self.potentialValues, result);
					self.calculating = false;
				}
				else {
					console.error("The provided result is not a list of available options", result);
					self.calculating = false;
				}
			}
			else {
				console.error("The provided items can not be resolved to a list of available options", result);
				self.calculating = false;
			}
		},
		isActive: function(entry) {
			if (this.extracter) {
				entry = this.extracter(entry);
			}
			return this.value instanceof Array ? this.value.indexOf(entry) >= 0 : this.value == entry;
		},
		select: function(value) {
			console.log("selecting", arguments);	
		},
		toggle: function(entry) {
			var raw = entry;
			if (this.extracter) {
				entry = this.extracter(entry);
			}
			if (this.value instanceof Array) {
				var index = this.value.indexOf(entry);
				if (index >= 0) {
					this.value.splice(index, 1);
				}
				else {
					this.value.push(entry);
				}
			}
			else {
				this.$emit("input", entry, this.formatter && raw ? this.formatter(raw) : raw, raw);
			}
		}
	}
});
