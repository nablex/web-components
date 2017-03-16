// parameter: arbitraryStepSelection: can click on any step in the wizard to jump back to there
// state preservation is an external concern

if (!nabu) { var nabu = {}; }
if (!nabu.components) { nabu.components = {}; }

nabu.components.wizard = Vue.component("n-wizard", {
	props: {
		// each step should have:
		// - name: this will be the displayed name for the step
		// - content: the content to be shown, if it is a function it will be executed and the returned value will be shown
		steps: {
			type: Array,
			required: true
		},
		// an initial step (if any), otherwise the first step will be used
		initial: {
			type: Object,
			required: false
		},
		number: {
			type: Boolean,
			required: false
		},
		// whether or not the "next" should loop around to the first step
		loop: {
			type: Boolean,
			required: false
		},
		// whether or not the top buttons are interactive
		browse: {
			type: Boolean,
			required: false
		}
	},
	template: "#n-wizard",
	data: function () {
		return {
			current: null
		}
	},
	ready: function() {
		this.current = this.initial ? this.initial : this.steps[0];
	},
	methods: {
		hasNext: function() {
			var index = this.steps.indexOf(this.current);
			return this.loop || index < this.steps.length - 1;
		},
		hasPrevious: function() {
			var index = this.steps.indexOf(this.current);
			return this.loop || index > 0;
		},
		next: function() {
			// it could be that for some reason your step is not in the list, could be you have a special first step
			// or that you updated the step list on the go
			// at this point this will be 0 so works out nicely
			var index = this.steps.indexOf(this.current) + 1;
			// if we went too far, go back
			if (index >= this.steps.length) {
				if (this.loop) {
					index = 0;
				}
				else {
					return this.current;
				}
			}
			this.current = this.steps[index];
			return this.current;
		},
		previous: function() {
			var index = this.steps.indexOf(this.current);
			// the current step was not in the steps, go to 0
			if (index < 0) {
				index = 0;
			}
			else {
				index--;
				if (index < 0) {
					if (this.loop) {
						index = this.steps.length - 1;
					}
					else {
						return this.current;
					}
				}
			}
			this.current = this.steps[index];
			return this.current;
		}
	},
	watch: {
		current: function(newValue) {
				console.log("RENDERING", newValue);
			if (newValue && newValue.content) {
				this.$render({
					target: this.$refs.container, 
					content: newValue.content
				});
			}
		}
	}
});