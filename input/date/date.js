Vue.component("n-input-date", {
	props: {
		value: {
			required: true
		},
		minimum: {
			required: false
		},
		maximum: {
			required: false
		},
		parser: {
			type: Function,
			required: false
		},
		formatter: {
			type: Function,
			required: false
		},
		// you can pass in a filter function that should return "true" if the passed in date is allowed 
		allow: {
			type: Function,
			required: false
		}
	},
	template: "#n-input-date",
	data: function() {
		return {
			date: null,
			day: null,
			month: null,
			year: null
		};
	},
	created: function() {
		if (!this.value) {
			this.date = new Date();
		}
		else if (this.value instanceof Date) {
			this.date = this.value;
		}
		else {
			this.date = this.parse(this.value);
		}
	},
	methods: {
		incrementMonth: function(amount) {
			return new Date(this.date.getFullYear(), this.date.getMonth() + amount, this.date.getDate());
		},
		canIncrementMonth: function(amount) {
			if (amount < 0) {
				return !this.minimum ? true : this.incrementMonth(amount) >= this.minimum;
			}
			else {
				return !this.maximum ? true : this.incrementMonth(amount) <= this.maximum;
			}
		},
		parse: function(date) {
			if (!date) {
				return null;
			}
			else if (this.parser) {
				return this.parser(date);
			}
			// defaults to "yyyy-MM-dd" format
			return new Date(
				parseInt(date.substring(0, 4)), 
				parseInt(date.substring(5, 7)), 
				parseInt(date.substring(8, 10)), 
				0, // hours,
				0, // minutes
				0, // seconds
				0 // milliseconds
			); 
		},
		format: function(date) {
			if (!date) {
				return null;
			}
			else if (this.formatter) {
				return this.formatter(date);
			}
			var result = date.getFullYear() + "-";
			var month = date.getMonth() + 1;
			result += (month < 10 ? "0" : "") + month + "-";
			var day = date.getDate();
			result += (day < 10 ? "0" : "") + day;
			return result;
		},
		isToday: function(date) {
			var today = new Date();
			return date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth() && date.getDate() == today.getDate();
		},
		isSelected: function(date) {
			return this.value && this.format(date) == this.value;
		},
		isAvailable: function(date) {
			return this.allow && this.allow(date);
		},
		select: function(date) {
			this.date = date;
			this.$emit("input", this.format(date));
		}
	},
	computed: {
		months: function() {
			var months = [];
			months.push("%{date:January}");
			months.push("%{date:February}");
			months.push("%{date:March}");
			months.push("%{date:April}");
			months.push("%{date:May}");
			months.push("%{date:June}");
			months.push("%{date:July}");
			months.push("%{date:August}");
			months.push("%{date:September}");
			months.push("%{date:October}");
			months.push("%{date:November}");
			months.push("%{date:December}");
			return months;
		},
		weeks: function() {
			var cells = [];
			var weeks = [[]];
			var week = 0;
			var firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
			var offset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
			var lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
			var daysInMonth = lastDay.getDate();

			// add empty cells at the front
			for (var i = 0; i < offset; i++) {
				cells.push({
					label: null,
					value: null
				});
			}

			// add days in month
			for (var i = 0; i < daysInMonth; i++) {
				cells.push({
					label: i + 1,
					value: new Date(this.date.getFullYear(), this.date.getMonth(), i + 1)
				});
			}

			// add empty cells at the back
			if (cells.length % 7 > 0) {
				var amountToAdd = 7 - (cells.length % 7);
				for (var i = 0; i < amountToAdd; i++) {
					cells.push({
						label: null,
						value: null
					});
				}
			}
			
			// divide days in weeks
			for (var i = 0; i < cells.length; i++) {
				weeks[week].push(cells[i]);
				if (weeks[week].length % 7 === 0) {
					week += 1;
					weeks.push([]);
				}
			}
			return weeks;
		}
	}
});