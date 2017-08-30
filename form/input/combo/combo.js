Vue.component("n-form-combo", {
	props: {
		value: {
			required: true
		},
		label: {
			type: String,
			required: false
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
		required: {
			type: Boolean,
			required: false,
			// explicitly set default value to null, otherwise vue will make it false which we can't distinguish from "not set"
			default: null
		},
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		edit: {
			type: Boolean,
			required: false,
			default: true
		},
		items: {
			type: Array,
			required: false
		},
		nillable: {
			type: Boolean,
			default: true
		}
	},
	template: "#n-form-combo",
	data: function() {
		return {
			valid: null,
			messages: []
		}
	},
	computed: {
		definition: function() {
			return nabu.utils.vue.form.definition(this);
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	methods: {
		validate: function() {
			var messages = nabu.utils.schema.json.validate(this.definition, this.value, this.mandatory);
			for (var i = 0; i < messages.length; i++) {
				messages[i].component = this;
			}
			this.valid = messages.length == 0;
			return messages;
		},
		updateValue: function(value) {
			this.$emit("input", value);
		},
		clear: function() {
			this.$refs.combo.clear();
		}
	},
	watch: {
		value: function(newValue) {
			console.log("new value is", newValue);
		}
	}
});