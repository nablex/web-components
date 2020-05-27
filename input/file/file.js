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
			default: "fa fa-times"			
		}
	},
	template: "#n-input-file",
	data: function() {
		return {
			// used to dynamically create new file names
			counter: 0,
			dragging: false
		}
	},
	methods: {
		hasDropSupport: function () {
			var div = document.createElement("div");
			return (("draggable" in div) || ("ondragstart" in div && "ondrop" in div)) && "FormData" in window && "FileReader" in window;
		},
		selectFiles: function(event) {
			var result = this.addFiles(event.target.files || event.dataTransfer.files);
			event.preventDefault();
			event.stopPropagation();
			return result;
		},
		addFiles: function(fileList) {
			var notAllowed = [];
			var changed = this.makeRoomFor(fileList.length);
			for (var i = 0; i < fileList.length; i++) {
				if ((!this.amount || this.value.length < this.amount) && this.isAllowedType(fileList.item(i).type)) {
					changed = true;
					this.value.push(fileList.item(i));
				}
				else {
					notAllowed.push(fileList.item(i));
				}
			}
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
					if ((!this.amount || this.value.length < this.amount) && this.isAllowedType(files[i].type)) {
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
			return type && (!this.types || !this.types.length || this.types.indexOf(type) >= 0 || this.types.indexOf(type.replace(/\/.*$/, "")) >= 0);
		},
		browse: function() {
			this.$refs.input.click();
		},
		removeFile: function (file) {
			this.value.splice(this.value.indexOf(file),1);
			this.$emit("change", this.value);
		}
	}
});
