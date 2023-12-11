Vue.component("n-input-combo2", {
	template: "#n-input-combo2",
	props: {
		value: {
			required: true
		},
		name: {
			required: false,
		},
		placeholder: {
			type: String
		},
		placeholderSelected: {
			type: String
		},
		items: {
			type: Array,
			required: false
		},
		filter: {
			type: Function,
			required: false
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
		// the input field itself has to be plain text (the formatter)
		// however, in the dropdowns (and in the future multiselect?) we can use html
		prettyFormatter: {
			type: Function,
			required: false
		},
		// allows you to group items together
		grouper: {
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
		allowTyping: {
			type: Boolean,
			default: false
		},
		timeout: {
			type: Number,
			default: 600
		},
		showTags: {
			type: Boolean,
			default: false
		},
		// set to 0 to get unlimited
		maxAmountOfTags: {
			default: 3
		},
		showAmount: {
			type: Boolean,
			default: false
		},
		deleteTagIcon: {
			type: String,
			default: "times"
		},
		autoclose: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	data: function() {
		return {
			showValues: false,
			// when you are allowed to type, filter the results
			search: null,
			// debounce on search changes
			searchTimer: null,
			filteredValues: [],
			potentialValues: [],
			// the actual raw values of the currently selected value(s)
			// note that the raw values are generally structures
			// if these structures are being fed from a REST service, it is entirely possible to have multiple versions in memory of the same object
			// when data is returned from the webservice, we will match the extracted value against the rawvalues, if it matches we replace the object
			rawValues: [],
			calculating: true,
			updating: false,
			focused: false,
			// the current value you have selected with your keys
			keyValue: null,
			// whether we have searched at all
			hasSearched: false,
			// keep track of the last search value, don't run again if it hasn't changed
			lastSearch: null,
			initialized: false
		}
	},
	created: function() {
		this.load();
	},
	computed: {
		visibleRawValues: function() {
			if (this.maxAmountOfTags != null && this.maxAmountOfTags > 0) {
				return this.rawValues.slice(Math.max(0, this.rawValues.length - this.maxAmountOfTags), this.rawValues.length);
			}
			return this.rawValues;
		},
		hiddenAmount: function() {
			if (this.maxAmountOfTags != null && this.maxAmountOfTags > 0) {
				return Math.max(0, this.rawValues.length  - this.maxAmountOfTags);
			}
			return 0;
		},
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
		currentPlaceholder: function() {
			if (!this.multiple || this.value == null || this.value.length == 0 || !this.placeholderSelected) {
				return this.placeholder;
			}
			else {
				return this.placeholderSelected.replace("{amount}", this.value.length);
			}
		}
	},
	methods: {
		deselect: function(rawValue) {
			if (rawValue == null) {
				this.rawValues.splice(0);
			}
			else {
				var index = this.rawValues.indexOf(rawValue);
				this.rawValues.splice(index, 1);
			}
		},
		getExtracted: function(entry) {
			if (this.extracter && entry != null) {
				entry = this.extracter(entry);
			}
			return entry;
		},
		getPrettyFormatted: function(entry) {
			if (this.prettyFormatter && entry != null) {
				return this.prettyFormatter(entry);
			}
			else {
				return this.getFormatted(entry);
			}
		},
		getFormatted: function(entry) {
			if (this.formatter && entry != null) {
				entry = this.formatter(entry);
			}
			return entry;
		},
		getPlainFormatted: function(entry) {
			var formatted = this.getFormatted(entry);
			if (formatted && formatted.replace) {
				formatted = formatted.replace(/<[^>]+>/g, "");
			}
			return formatted;
		},
		isEqual: function(entry1, entry2) {
			if (this.extracter) {
				return this.extracter(entry1) == this.extracter(entry2);
			}
			else {
				return JSON.stringify(entry1) == JSON.stringify(entry2);
			}
		},
		showIfFocus: function() {
			if (this.$refs.searchInput == document.activeElement) {
				this.showValues = true;
			}
		},
		initializeKeyValue: function() {
			// if you have no key value yet, we just take the first one
			if (this.keyValue == null) {
				this.keyValue = this.potentialValues[0];
			}
		},
		commitKeyValue: function($event) {
			if (this.keyValue != null) {
				this.toggle(this.keyValue);
			}
			$event.stopPropagation();
			$event.preventDefault();
		},
		moveUp: function($event) {
			this.moveKeyValue(-1);
			$event.stopPropagation();
			$event.preventDefault();
		},
		moveDown: function($event) {
			this.moveKeyValue(1);
			$event.stopPropagation();
			$event.preventDefault();
		},
		moveKeyValue: function(amount) {
			// only relevant if you can see something
			this.showValues = true;
			this.initializeKeyValue();
			if (this.keyValue != null) {
				var index = this.potentialValues.indexOf(this.keyValue);
				index += amount;
				if (index < this.potentialValues.length && index >= 0) {
					this.keyValue = this.potentialValues[index];
					var self = this;
					Vue.nextTick(function() {
						// make sure it is visible
						var list = self.$refs.valueList.querySelectorAll("li");
						var target = list.item(index);
						target.scrollIntoView({
							behavior: "smooth", 
							block: "center"
						});
					})
				}
			}
		},
		load: function() {
			var valueToSearch = this.search;
			if (valueToSearch != null && valueToSearch.trim() == "") {
				valueToSearch = null;
			}
			// if we are in the singular usecase and the search matches the formatted value of the current item, don't search for that
			if (!this.multiple && this.rawValues.length && this.getPlainFormatted(this.rawValues[0]) == valueToSearch) {
				valueToSearch = null;
			}
			if (this.hasSearched) {
				if (valueToSearch == this.lastSearch) {
					return;
				}
			}
			else {
				this.hasSearched = true;
			}
			this.lastSearch = valueToSearch;
			
			var self = this;
			self.calculating = true;
			
			// if we get multiple instances of the same data structure we want to ensure we have only one version in memory to ensure that all the equality checks keep working
			// otherwise there are way too many "easy" mistakes to make
			var normalize = function(results) {
				if (results) {
					for (var i = 0; i < results.length; i++) {
						var match = self.rawValues.filter(function(single) {
							return self.isEqual(single, results[i]);
						})[0];
						if (match) {
							results[i] = match;
						}
					}
				}
				return results;
			}
			if (this.items) {
				self.potentialValues.splice(0);
				nabu.utils.arrays.merge(this.potentialValues, normalize(this.items));
				self.calculating = false;
				self.showIfFocus();
			}
			else if (this.filter) {
				var result = this.filter(valueToSearch);
				if (result && result.then) {
					result.then(function(result) {
						self.potentialValues.splice(0);
						if (result instanceof Array) {
							nabu.utils.arrays.merge(self.potentialValues, normalize(result));
						}
						self.calculating = false;
						self.showIfFocus();
					})
				}
				else if (result instanceof Array) {
					self.potentialValues.splice(0);
					nabu.utils.arrays.merge(self.potentialValues, normalize(result));
					self.calculating = false;
					self.showIfFocus();
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
		// make sure we have the necessary values in our raw list
		synchronize: function(values) {
			if (values == null) {
				values = [];
			}
			else if (!(values instanceof Array)) {
				values = [values];
			}
			var self = this;
			// if we actually have values
			if (values.length > 0) {
				// and we have an extracter
				if (this.extracter) {
					// in the beginning we might have one or more values for the component
					// however we will not have the corresponding raw values
					// we need to resolve them
					// hopefully they are available in the potential values but they might not be at which point we need to switch to the resolver
					// if other components alter the values, we might have a mismatched length
					if (this.rawValues.length != values.length) {
						var missing = [];
						// if we have an extracter, we need to extract all the values from the potential to match them with the ones we have
						var toMatch = this.extracter ? this.potentialValues.map(function(x) { return self.extracter(x) }) : this.potentialValues;
						this.rawValues.splice(0);
						nabu.utils.arrays.merge(this.rawValues, values.map(function(single) {
							var index = toMatch.indexOf(single);
							if (index < 0) {
								missing.push(single);
							}
							return index >= 0 ? self.potentialValues[index] : null;
						}));
						// if we can't resolve it against the initial listing, use the resolver (if it exists)
						if (missing.length && this.resolver != null) {
							var result = this.resolver(this.isMultiple ? missing : missing[0]);
							var mergeValues = function(actualValues) {
								if (!(actualValues instanceof Array)) {
									actualValues = [actualValues];
								}
								var toMatch = self.extracter ? actualValues.map(function(x) { return self.extracter(x) }) : actualValues;
								var remove = [];
								missing.forEach(function(single) {
									var targetIndex = self.values.indexOf(single);
									var matchIndex = toMatch.indexOf(single);
									if (matchIndex >= 0) {
										self.rawValues.splice(targetIndex, 1, toMatch[matchIndex]);
									}
									else {
										remove.unshift(single);
										console.warn("Can not resolve existing value", single);
									}
								});
								remove.forEach(function(single) {
									var targetIndex = self.values.indexOf(single);
									// remove the null placeholder
									self.rawValues.splice(targetIndex, 1);
									// remove the value that we can not resolve
									self.values.splice(targetIndex, 1);
								});
								self.emitLabel();
							};
							if (result != null && result.then) {
								result.then(mergeValues);
							}
							else if (result != null) {
								mergeValues(result);
							}
						}
					}
				}
				// if we don't have an extracter, the raw values are the same as the actual values
				else {
					nabu.utils.arrays.merge(this.rawValues, values);
				}
			}
			// if we have no value but it is not nillable, we select the first potential value
			else if (!this.nillable && this.potentialValues.length > 0) {
				this.rawValues.push(this.potentialValues[0]);
			}
			// make sure we have no raw values left
			else {
				this.rawValues.splice(0);
			}
		},
		toggleAll: function() {
			if (this.rawValues.length == this.potentialValues.length) {
				this.rawValues.splice(0);
			}
			else {
				var parameters = [];
				parameters.push(0);
				parameters.push(0);
				var self = this;
				// push only the ones not in the list yet
				nabu.utils.arrays.merge(parameters, this.potentialValues.filter(function(x) {
					return self.rawValues.indexOf(x) < 0;
				}));
				this.rawValues.splice.apply(this.rawValues, parameters);
			}
		},
		toggle: function(entry) {
			var index = this.rawValues.indexOf(entry);
			if (index < 0) {
				if (!this.multiple) {
					this.rawValues.splice(0);
				}
				this.rawValues.push(entry);
				// if you can't select multiple, close the popup
				if (!this.multiple) {
					this.showValues = false;
				}
			}
			else {
				this.rawValues.splice(index, 1);
			}
		}
	},
	watch: {
		calculating: function(newValue) {
			if (!newValue && !this.initialized) {
				if (this.value != null) {
					this.synchronize(this.value);
				}
				this.initialized = true;
			}
		},
		// if our potential values change, our key value is reset
		potentialValues: function() {
			this.keyValue = null;	
		},
		// push to values
		rawValues: function() {
			var self = this;
			this.updating = true;
			if (this.multiple) {
				var labels = [];
				var parameters = this.rawValues.map(function(single) {
					labels.push(self.getFormatted(single));
					return self.getExtracted(single);
				});
				parameters.unshift(this.value.length);
				parameters.unshift(0);
				// we want it to be one atomic action
				this.value.splice.apply(this.value, parameters);
				// emit labels separately
				this.$emit("label", labels);				
			}
			else {
				// update the search text to match the formatted value
				// this will also trigger a new search without text which is a good thing
				this.search = this.getPlainFormatted(this.rawValues[0]);
				this.$emit("input", 
					this.getExtracted(this.rawValues[0]), 
					this.getFormatted(this.rawValues[0]), 
					this.rawValues[0]
				);
			}
		},
		value: {deep: true, handler: function() {
			if (this.updating) {
				this.updating = false;
			}
			else {
				this.synchronize(this.value);
			}
		}},
		search: function(newValue) {
			// if you emptied it out 
			if (!this.multiple && this.nillable && (newValue == null || newValue.trim() == "")) {
				this.$emit("input", null);
			}
			if (this.searchTimer) {
				clearTimeout(this.searchTimer);
				this.searchTimer = null;
			}
			this.searchTimer = setTimeout(this.load, 600);
		}
	}
});
