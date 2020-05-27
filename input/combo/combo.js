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
		// used to resolve an extracted value into a valid item usually returned by filter
		resolver: {
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
		allowTyping: {
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
		autocomplete: {
			type: String,
			default: "off"
		},
		autoselectSingle: {
			type: Boolean,
			required: false
		},
		caseInsensitive: {
			type: Boolean,
			required: false,
			default: false
		},
		allowTypeMatch: {
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
			updatingContent: false,
			actualValue: null,
			// the value selected with the keys
			keyValue: null,
			stillFocused: false
		}
	},
	created: function() {
		if (this.labels) {
			this.label = this.initialLabel && this.labels.indexOf(this.initialLabel) >= 0 ? this.initialLabel : this.labels[0];
		}
		if (this.filter && !this.disabled) {
			try {
				this.filterItems(this.content, this.label, null, true);
			}
			catch (exception) {
				console.error("Could not perform initial filter", exception);
			}
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
		// do a synchronization if we do not have an extracter, we are not dependend on values being loaded then, the resolver does make it possible
		if (!this.extracter || this.resolver) {
			this.synchronizeValue(true);
		}
	},
	computed: {
		formatted: function() {
			return this.formatter && this.actualValue != null ? this.formatter(this.actualValue) : this.actualValue;
		}
	},
	methods: {
		focusOn: function($event) {
			var self = this;
			this.stillFocused = true;
			// in the address component you have multiple combos after one another
			// filling in a correct value in one, enables the next one and puts focus on it
			// however, we can trigger that by clicking anywhere with the mouse (so not on this combo)
			// it seems the focus event is triggered before the mouse event that triggers the auto close
			// so the showvalues is briefly set to true by the on focus and immediately set to false by the auto close
			// for this reason, we do the showvalues in a tiny timeout to circumvent this behavior
			setTimeout(function() {
				if (self.stillFocused) {
					self.showValues = true;
				}
			}, 100);
		},
		focusOut: function($event) {
			var self = this;
			// if you didn't select one but you did start typing
			if (self.value == null && self.keyValue != null && self.content != null && self.content.trim().length > 0) {
				var keyValue = self.keyValue;
				self.keyValue = null;
				self.updateValue(keyValue);
			}
		},
		synchronizeValue: function(initial) {
			var self = this;
			var hadValue = this.actualValue != null;
			if (this.value != null) {
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
					// if we can't resolve it against the initial listing, use the resolver (if it exists)
					if (this.resolver != null && (!this.actualValue || this.extracter(this.actualValue) != this.value)) {
						var result = this.resolver(this.value);
						if (result != null && result.then) {
							result.then(function(actualValue) {
								// you are likely using the same service for filter and resolve
								// the filter should send back an array of items
								if (actualValue instanceof Array) {
									actualValue = actualValue[0];
								}
								self.actualValue = actualValue;
								if (initial) {
									self.content = self.actualValue != null ? (self.formatter ? self.formatter(self.actualValue) : self.actualValue) : null;
								}
								self.$emit("label", self.actualValue != null ? (self.formatter ? self.formatter(self.actualValue) : self.actualValue) : null);
							});
						}
						else if (result != null) {
							self.actualValue = self.extracter(result);
							self.$emit("label", self.actualValue != null ? (self.formatter ? self.formatter(self.actualValue) : self.actualValue) : null);
						}
					}
				}
				else {
					this.actualValue = this.value;
				}
			}
			else if (!this.nillable && this.values.length > 0) {
				// it could be that we have already emitted a newly selected value (that we selected here) but that is not reflected yet
				// so check that we don't get stuck in a loop between updating, filterItems and synchronizeValue
				if (!this.updatingContent || !this.actualValue) {
					this.updateValue(this.values[0]);
				}
			}
			else {
				this.actualValue = null;
			}
			// only update the content if this is the initial setting
			// afterwards people just type and it remains
			if (initial) {
				// if we did not have a value before, we stranded mid-type, no need to wipe it
				if (this.actualValue != null || hadValue) {
					this.content = this.actualValue != null ? (this.formatter ? this.formatter(this.actualValue) : this.actualValue) : null;
				}
			}
			self.$emit("label", self.actualValue != null ? (self.formatter ? self.formatter(self.actualValue) : self.actualValue) : null);
			
			if (this.keyValue && this.values.indexOf(this.keyValue) < 0) {
				this.keyValue = null;
			}
			
			if (this.keyValue == null) {
				this.setKeyValue();
			}
		},
		validateKey: function($event) {
			if (!this.allowTyping) {
				$event.preventDefault();
				$event.stopPropagation();
			}	
		},
		validateEnter: function($event) {
			if (this.keyValue != null) {
				$event.preventDefault();
				$event.stopPropagation();
				var value = this.keyValue;
				this.keyValue = null;
				this.updateValue(value);
				this.showValues = false;
			}
		},
		validateTab: function($event) {
			if (this.keyValue != null && $event.shiftKey == false && this.showValues) {
				var value = this.keyValue;
				this.keyValue = null;
				this.updateValue(value);
			}
			this.showValues = false;
		},
		doEscape: function() {
			this.showValues = false;
			this.keyValue = null;
		},
		moveUp: function($event) {
			this.showValues = true;
			if (this.keyValue == null) {
				var index = this.value ? this.values.indexOf(this.value) : -1;
				if (index > 0) {
					this.keyValue = this.values[index - 1];
				}
				else {
					this.keyValue = this.values.length ? this.values[0] : null;
				}
			}
			else {
				var index = this.values.indexOf(this.keyValue);
				if (index < 0) {
					this.keyValue = this.values.length ? this.values[0] : null;
				}
				else if (index > 0) {
					this.keyValue = this.values[index - 1];
				}
				this.scrollTo("pondering");
			}
			$event.preventDefault();
			$event.stopPropagation();
		},
		moveDown: function($event) {
			this.showValues = true;
			if (this.keyValue == null) {
				var index = this.value ? this.values.indexOf(this.value) : -1;
				if (index >= 0) {
					if (index < this.values.length - 1) {
						this.keyValue = this.values[index + 1];
					}
					else {
						this.keyValue = this.value;
					}
				}
				else {
					this.keyValue = this.values.length ? this.values[0] : null;
				}
			}
			else {
				var index = this.values.indexOf(this.keyValue);
				if (index < 0) {
					this.keyValue = this.values.length ? this.values[0] : null;
				}
				else if (index < this.values.length - 1) {
					this.keyValue = this.values[index + 1];
				}
				this.scrollTo("pondering");
			}
			$event.preventDefault();
			$event.stopPropagation();
		},
		scrollTo: function(clazz) {
			var target = this.$el.querySelector("." + clazz);
			if (target) {
				target.parentNode.scrollTop = target.offsetTop - (target.parentNode.offsetHeight / 2);
			}
		},
		clear: function() {
			this.content = null;
			if (this.filter) {
				this.filterItems(this.content, this.label);
			}
		},
		refilter: function() {
			this.filterItems(this.content, this.label);
		},
		setKeyValue: function() {
			var self = this;
			if (self.showValues && self.keyValue == null) {
				if (self.value && self.values.indexOf(self.value) >= 0) {
					self.keyValue = self.value;
				}
				else if (self.values.length) {
					self.keyValue = self.values[0];
				}
			}
		},
		filterItems: function(content, label, match, initial) {
			// if we trigger a filterItems with no content, we might be doing this right after we have selected a match
			// in this case we might want to explicitly close the value dropdown
			// which means, in such a case, the caller is responsible for explicitly showing the items if still relevant
			if (this.stillFocused && content) {
				this.showValues = true;
			}
			var result = this.filter(content, label);
			this.values.splice(0, this.values.length);
			if (result instanceof Array) {
				nabu.utils.arrays.merge(this.values, result);
				this.synchronizeValue(initial);
				if (match) {
					if (this.checkForMatch(content) != null) {
						this.filterItems(null, label, false);
					}
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
						if (self.checkForMatch(content) != null) {
							self.filterItems(null, label, false);
						}
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
				if (formatted == value || (this.caseInsensitive && formatted.toLowerCase && value && value.toLowerCase && formatted.toLowerCase() == value.toLowerCase())) {
					match = this.values[i];
					break;
				}
			}
			// only update the value if it matches a value in the dropdown list 
			if (match != null || (!value && this.nillable)) {
				this.updatingContent = true;
				this.actualValue = value;
				this.$emit("input", this.extracter && match ? this.extracter(match) : match, this.label);
				this.$emit("label", this.formatter && match ? this.formatter(match) : match, this.label);
			}
			// if it is nillable and the current bound value has some value, reset it to null
			else if (this.nillable && this.value) {
				this.updatingContent = true;
				this.$emit("input", null);
				this.$emit("label", null);
			}
			return match;
		},
		updateContent: function(value) {
			// explicitly set it, the v-model does not always seem to work in combination with the input event?
			this.content = value;
			var match = this.allowTypeMatch ? this.checkForMatch(value) : null;
			
			// hide dropdown if you have a match by typing
			if (match) {
				this.showValues = false;
				this.keyValue = null;
			}

			// try to finetune the results
			if (this.filter) {
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
				if (this.timeout) {
					var self = this;
					this.timer = setTimeout(function() {
						self.filterItems(match || !value ? null : value, self.label, !match && this.allowTypeMatch);
					}, this.timeout);
				}
				else {
					this.filterItems(match || !value ? null : value, this.label, !match && this.allowTypeMatch);
				}
			 }
		},
		// if we hide immediately on blur, we don't register the click event anymore
		hideSlowly: function() {
			var self = this;
			setTimeout(function() {
				self.showValues = false;
			}, 500);
		},
		// you select something from the dropdown
		updateValue: function(value) {
			this.keyValue = null;
			this.updatingContent = true;
			this.actualValue = value;
			this.$emit("input", this.extracter && value ? this.extracter(value) : value, this.label);
			this.$emit("label", this.formatter && value ? this.formatter(value) : value, this.label);
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
			if (this.updatingContent) {
				this.synchronizeValue(false);
				this.updatingContent = false;
			}
			else {
				this.synchronizeValue(true);
			}
			this.keyValue = null;
			this.setKeyValue();
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
		},
		showValues: function(newValue) {
			if (newValue) {
				var self = this;
				this.keyValue = null;
				this.setKeyValue();
				Vue.nextTick(function() {
					self.scrollTo("active");
				});
			}
			else {
				this.keyValue = null;
			}
		},
		formatted: function(newValue) {
			if (newValue) {
				this.content = newValue;
			}
		}
	}
});


