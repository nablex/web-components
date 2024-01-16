Vue.component("n-input-file", {
	props: {
		value: {
			type: Array,
			required: true
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
		visualiseSelectedFiles: {
			type: Boolean,
			required: false,
			default: false
		},
		deleteIcon: {
			type: String,
			required: false,
			default: "times"
		},
		restrictionMessage: {
			type: String,
			required: false
		},
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		required: {
			type: Boolean,
			required: false,
			// explicitly set default value to null, otherwise vue will make it false which we can't distinguish from "not set"
			default: null
		},
		visualizeFileNames: {
			type: Boolean,
			required: false,
			default: false
		},
		buttonClass: {
			required: false
		},
		capture: {
			type: String,
			required: false,
			default: null
		},
		fileNameDeleteClass: {
			required: false
		},
		fileNameContainerClass: {
			required: false
		},
		fileNameRowClass: {
			required: false
		},
		fileNameClass: {
			required: false
		}
	},
	template: "#n-input-file",
	data: function() {
		return {
			// used to dynamically create new file names
			counter: 0,
			dragging: false,
			messages: []
		}
	},
	methods: {
		dragOver: function($event) {
			this.dragging = true; 
			$event.preventDefault();
		},
		hasDropSupport: function () {
			var div = document.createElement("div");
			return (("draggable" in div) || ("ondragstart" in div && "ondrop" in div)) && "FormData" in window && "FileReader" in window;
		},
		selectFiles: function(event) {
			var result = this.addFiles(event.target.files || event.dataTransfer.files);
			event.preventDefault();
			event.stopPropagation();
			this.$refs.input.value = "";
			return result;
		},
		addFiles: function(fileList) {
			var notAllowed = [];
			var changed = this.makeRoomFor(fileList.length);
			for (var i = 0; i < fileList.length; i++) {
				if ((!this.amount || this.value.length < this.amount) && this.isAllowedType(fileList.item(i).type) && this.isAllowedSize(fileList.item(i).size)) {
					changed = true;
					this.value.push(fileList.item(i));
				}
				else {
					notAllowed.push(fileList.item(i));
				}
			}
			this.validate();
			if (changed) {
				this.$emit("change", this.value);
			}
			return notAllowed;
		},
		// if we add more files then allowed, drop the oldest ones
		makeRoomFor: function(amount) {
			if (this.amount != null && this.amount > 0) {
				var tooMany = (this.value.length + amount) - this.amount;
				if (tooMany > 0) {
					this.value.splice(0, tooMany);
					return true;
				}
			}
			return false;
		},
		pasteFiles: function(event) {
			var files = event.clipboardData ? event.clipboardData.items : null;
			var notAllowed = [];
			if (files) {
				var changed = this.makeRoomFor(files.length);
				for (var i = 0; i < files.length; i++) {
					if ((!this.amount || this.value.length < this.amount) && this.isAllowedType(files[i].type) && this.isAllowedSize(files[i].size)) {
						var blob = files[i].getAsFile();
						changed = true;
						this.value.push(new File([blob], "pasted_file_" + this.counter++, { type: files[i].type}));
					}
					else {
						notAllowed.push(files[i]);
					}
				}
				if (changed) {
					this.$emit("change", this.value);
				}
			}
			return notAllowed;
		},
		isAllowedType: function(type) {
			return !this.types || !this.types.length || (type && (this.types.indexOf(type) >= 0 || this.types.indexOf(type.replace(/\/.*$/, "") + "/*") >= 0));
		},
		isAllowedSize: function(size) {
			if (!this.maxFileSize) {
				return true;
			}
			if (size == null) {
				return false;
			}
			return size <= this.maxFileSize ? true : false;
		},
		isAllAllowedSize: function() {
			var self = this;
			return this.value.reduce(function(current, file) {
				return current && self.isAllowedSize(file.size);
			}, true);
		},
		isAllAllowedType: function() {
			var self = this;
			return this.value.reduce(function(current, file) {
				return current && self.isAllowedType(file.type);
			}, true);
		},		
		browse: function() {
			this.$refs.input.click();
		},
		removeFile: function (file) {
			this.value.splice(this.value.indexOf(file),1);
			this.$emit("change", this.value);
		},
		validate: function(soft) {
			this.messages.splice(0);
			var messages = [];
			var mandatory = nabu.utils.vue.form.mandatory(this);
			if (!this.isAllAllowedType()) {
				var title = "%{validation:This file type is not allowed}";
				messages.push({
					severity: "error",
					code: "invalidFileType",
					title: title,
					priority: -1,
					values: {
						actual: this.value.map(function(x) { return x.type }),
						expected: this.types
					},
					context: [this]
				});
			}
			if (!this.isAllAllowedSize()) {
				var title = "%{validation:This file is too big, the maximum file size is {maxFileSize}}";
				if (this.maxFileSize < 1024 * 1024) {
					title = title.replace("{maxFileSize}", (this.maxFileSize / 1024) + "kb");
				}
				else {
					title = title.replace("{maxFileSize}", (this.maxFileSize / (1024 * 1024)) + "mb");
				}
				messages.push({
					severity: "error",
					code: "invalidFileSize",
					title: title,
					priority: -1,
					values: {
						actual: this.value.map(function(x) { return x.size }),
						expected: this.maxFileSize
					},
					context: [this]
				});
			}
			if (mandatory && this.value.length < 1) {
				messages.push({
					soft: true,
					severity: "error",
					code: "required",
					title: "%{validation:The value is required}",
					priority: 0,
					values: {
						actual: false,
						expected: true
					},
					context: [this]
				});
			}
			nabu.utils.arrays.merge(self.messages, nabu.utils.vue.form.localMessages(self, messages));
			return messages;
		}	
	}
});
