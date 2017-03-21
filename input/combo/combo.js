Vue.component("n-combobox", {
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
		}
	},
	template: "#n-combobox",
	data: function() {
		return {
			label: null,
			showLabels: false,
			showValues: false,
			values: [],
			content: null
		}
	},
	created: function() {
		if (this.labels) {
			this.label = this.labels[0];
		}
		this.content = this.value != null && this.formatter ? this.formatter(this.value) : this.value;
		if (this.filter) {
			this.filterItems(this.content, this.label);
		}
	},
	methods: {
		clear: function() {
			this.content = null;
		},
		filterItems: function(content, label) {
			var result = this.filter(content, label);
			this.values.splice(0, this.values.length);
			if (result instanceof Array) {
				nabu.utils.arrays.merge(this.values, result);
			}
			else if (result.then) {
				result.then(function(results) {
					nabu.utils.arrays.merge(this.values, results);
				});
			}
		},
		updateContent: function(value) {
			var match = null;
			for (var i = 0; i < this.values.length; i++) {
				var formatted = this.values[i] != null && this.formatter ? this.formatter(this.values[i]) : this.values[i];
				if (formatted == value) {
					match = this.values[i];
					break;
				}
			}
			// only update the value if it matches a value in the dropdown list 
			if (match != null) {
				this.$emit("input", match);
			}
			// try to finetune the results
			else if (this.filter) {
				this.filterItems(value, this.label);
			}
		},
		// you select something from the dropdown
		updateValue: function(value) {
			this.$emit("input", value);
			this.content = value != null && this.formatter ? this.formatter(value) : value;
		},
		selectLabel: function(label) {
			this.content = null;
			if (this.filter) {
				this.filterItems(this.content, label);
			}
			this.label = label;
		}
	}
});