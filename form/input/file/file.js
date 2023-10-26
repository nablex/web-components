Vue.component("n-form-file", {
	props: {
		value: {
			required: true
		},
		label: {
			type: String,
			required: false
		},
		// whether or not you are in edit mode
		edit: {
			type: Boolean,
			required: false,
			default: true
		},
		required: {
			type: Boolean,
			required: false,
			// explicitly set default value to null, otherwise vue will make it false which we can't distinguish from "not set"
			default: null
		},
		name: {
			type: String,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		info: {
			type: String,
			required: false
		},
		infoIcon: {
			type: String,
			required: false
		},
		prefix: {
			type: String,
			required: false
		},
		prefixIcon: {
			type: String,
			required: false
		},
		suffix: {
			type: String,
			required: false
		},
		suffixIcon: {
			type: String,
			required: false
		},
		before: {
			type: String,
			required: false
		},
		after: {
			type: String,
			required: false
		},
		allow: {
			type: Function,
			required: false
		},
		// if you want the value to be formatted before it is shown, set a formatter
		formatter: {
			type: Function,
			required: false
		},
		// this function is used on blur
		masker: {
			type: Function,
			required: false
		},
		// if you want the value to be parsed before it is emitted, set a parser
		parser: {
			type: Function,
			required: false
		},
		// you can set alternative text values for specific validation codes
		// send in for example {'required': 'This field is required'}
		// we support complex overrides as well where you can set {'required': { title: 'this field is required'}}
		// at this point the data will be merged
		// you can also set an array of objects [{code: 'required', title: 'this field is required'}]
		codes: {
			required: false
		},
		types: {
			type: Array,
			required: false
		},
		// amount of files allowed (default unlimited)
		amount: {
			required: false
		},
		// in bytes, you can explicitly pass in 0 to set to unlimited
		maxFileSize: {
			type: Number,
			required: false	
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		browseLabel: {
			type: String,
			required: false
		},
		dropLabel: {
			type: String,
			required: false
		},
		browseIcon: {
			type: String,
			required: false
		},
		deleteIcon: {
			type: String,
			required: false,
			default: "fa fa-times"			
		},
		restrictionMessage: {
			type: String,
			required: false
		},
		buttonClass: {
			required: false
		},
		visualizeFileNames: {
			type: Boolean,
			required: false
		},
		fileNameDeleteClass: {
			required: false
		},
		fileNameContainerClass: {
			required: false
		},
		fileNameClass: {
			required: false
		}
	},
	template: "#n-form-file",
	data: function() {
		return {
			messages: [],
			valid: null,
			timer: null,
			localValue: null,
			offsetX: 0,
			blurred: false,
			valueToCommit: null
		};
	},
	methods: {
		validate: function(soft) {
			return this.$refs.form.validate(soft);
		}
	}
});