Vue.component("n-form-image-uploader-configure", {
	template: "#n-form-image-uploader-configure",
	props: {
		cell: {
			type: Object,
			required: true
		},
		page: {
			type: Object,
			required: true
		},
		// the fragment this image is in
		field: {
			type: Object,
			required: true
		},
		childComponents: {
			type: Object,
			required: false
		}
	}
});
Vue.component("n-form-image-uploader", {
	template: "#n-form-image-uploader",
	props: {
		cell: {
			type: Object,
			required: true
		},
		page: {
			type: Object,
			required: true
		},
		field: {
			type: Object,
			required: true
		},
		value: {
			required: true
		},
		parentValue: {
			required: false
		},
		timeout: {
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		schema: {
			type: Object,
			required: false
		},
		edit: {
			type: Boolean,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		readOnly: {
			type: Boolean,
			required: false,
			default: false
		},
		contentField: {
			type: String,
			default: "content"
		},
		nameField: {
			type: String,
			default: "contentName"
		},
		typeField: {
			type: String,
			default: "contentType"
		},
		childComponents: {
			type: Object,
			required: false
		}
	},
	data: function() {
		return {
			files: [],
			fileTypes: [],
			// the files that are being worked on
			working: [],
			messages: [],
			selectedImage: null,
			// this component supports both arrays and singular elements
			// this boolean keeps track of the type
			singular: false,
			valid: null
		}
	},
	computed: {
		remaining: function() {
			var maximum = this.field.maximum ? parseInt(this.field.maximum) : null;
			if (maximum == null) {
				return null;
			}
			return maximum - (this.files.length + this.storedAmount);
		},
		storedAmount: function() {
			if (this.field.binary) {
				return this.value != null ? 1 : 0;
			}
			else if (this.singular) {
				return this.value[this.contentField] != null ? 1 : 0;
			}
			else {
				return this.value.length;
			}
		}
	},
	created: function() {
		if (!this.field.hasOwnProperty("showLargeSelectedReadOnly")) {
			Vue.set(this.field, "showLargeSelectedReadOnly", true);
		}
		var self = this;
		if (this.field.binary) {
			this.singular = true;
		}
		else if (this.value instanceof Array) {
			this.singular = false;
		}
		else if (this.value != null) {
			this.singular = true;
		}
		else {
			// we try to automatically deduce whether we are dealing with an array or an object
			var arrays = this.$services.page.getAllArrays(this.page);
			if (arrays.indexOf(this.field.name) >= 0 || arrays.indexOf("page." + this.field.name) >= 0) {
				this.singular = false;
			}
			else {
				this.singular = true;
			}
		}
		if (!this.value) {
			this.$emit("input", this.singular ? (this.field.binary ? null : {}) : []);
			//this.$services.page.setValue(this.parentValue, this.field.name, this.singular ? {} : []);
		}
		else {
			this.processImages(this.value);
		}
		// by default this is only an image uploader
		if (!this.field.allowNonImages) {
			nabu.utils.arrays.merge(this.fileTypes, ["image/jpeg", "image/png", "image/svg+xml"]);
		}
	},
	methods: {
		getChildComponents: function() {
			return [{
				title: "Image Entry Wrapper",
				name: "image-entry-wrapper",
				component: "column"
			}, {
				title: "Image Hero Wrapper",
				name: "image-hero-wrapper",
				component: "column"
			}, {
				title: "Image Entry",
				name: "image-entry",
				component: "image"
			}, {
				title: "Image Hero",
				name: "image-hero",
				component: "image"
			}, {
				title: "Image Container",
				name: "image-container",
				component: "row"
			}, {
				title: "Image Title",
				name: "image-title",
				component: "h6"
			}, {
				title: "File Input",
				name: "file-input",
				component: "column"
			}, {
				title: "File Input Button",
				name: "file-input-button",
				component: "button"
			}, {
				title: "Remove Button",
				name: "file-delete-button",
				component: "button"
			}]
		},
		validate: function(soft) {
			var minimum = this.field.minimum ? parseInt(this.field.minimum) : null;
			var messages = [];
			if (minimum != null && this.files.length + this.storedAmount < minimum) {
				messages.push({
					severity: "error",
					code: "not-enough-files",
					title: "%{You need to add at least {minimum} image(s)}", 
					values: {
						minimum: minimum
					}
				});
			}
			this.valid = messages.length == 0;
			nabu.utils.arrays.merge(this.messages, nabu.utils.vue.form.localMessages(this, messages));
			return messages;
		},
		changed: function() {
			var self = this;
			this.messages.splice(0);
			this.valid = null;
			var maximum = this.field.maximum ? parseInt(this.field.maximum) : null;
			// only one allowed, remove the current one
			if ((this.field.binary || this.singular) && this.files.length == 1) {
				this.$emit("input", this.field.binary ? null : {});
				self.working.push(this.files[0]);
				self.resizeAndAdd(this.files[0]);
			}
			else if (maximum != null && this.files.length + this.storedAmount + this.working.length > maximum) {
				this.messages.push({
					severity: "info",
					code: "too-many-files",
					title: "%{You can only add {maximum} images}", 
					values: {
						maximum: maximum
					}
				});
			}
			else {
				this.files.forEach(function(file) {
					// not yet busy with it
					if (self.working.indexOf(file) < 0) {
						self.working.push(file);
						self.resizeAndAdd(file);
					}
				});
			}
			this.files.splice(0);
		},
		remove: function(index) {
			var self = this;
			if (this.singular) {
				// set everything to null
				self.value[self.nameField] = null;
				self.value[self.typeField] = null;
				self.value[self.contentField] = null;
				self.value["$url"] = null;
				this.selectedImage = null;
			}
			else {
				if (this.selectedImage == this.value[index]) {
					this.selectedImage = null;
				}
				this.value.splice(index, 1);
			}
			this.messages.splice(0);
			this.valid = null;
			this.$emit("changed");
		},
		getPlaceholder: function(file) {
			// TODO: if for example we don't have an image but a pdf we may want to show a clean pdf logo
			// however, for now, we just return the $url, knowing full well that it is not a valid image, but otherwise we have _nothing_ which is even worse
			return this.field.emptyImage ? this.field.emptyImage : file.$url;
		},
		resizeAndAdd: function(file) {
			var self = this;
			var reader = new FileReader();
			reader.onload = function(readerEvent) {
				var applyUrl = function(dataUrl) {
					var result = {};
					result["$url"] = dataUrl;
					result[self.contentField] = self.urlToBlob(dataUrl);
					result[self.nameField] = file.name;
					result[self.typeField] = file.type ? file.type : (self.field.allowNonImages ? "application/octet-stream" : "image/jpeg");
					if (self.field.binary) {
						// enrich blob with file data that is lost during resize
						result[self.contentField].name = file.name;
						result[self.contentField].type = file.type;
						result[self.contentField]["$url"] = dataUrl;
						// emit the blob itself
						self.$emit("input", result[self.contentField]);
					}
					else if (self.singular) {
						//nabu.utils.objects.merge(self.value, result);
						Object.keys(result).forEach(function(key) {
							Vue.set(self.value, key, result[key]);
						});
					}
					else {
						self.value.push(result);
					}
					if (self.selectedImage == null) {
						self.selectedImage = result;
					}
					// splice it from the arrays
					var index = self.working.indexOf(file);
					if (index >= 0) {
						self.working.splice(index, 1);
					}
					self.$emit("changed");
				}
				if (file.type.indexOf("image/") == 0) {
					var image = new Image();
					image.onload = function (imageEvent) {
						var canvas = document.createElement('canvas');
						var maxSize = self.field.maxResolution ? parseInt(self.field.maxResolution) : 1024;
						var width = image.width;
						var height = image.height;
						if (maxSize != null && maxSize > 0) {
							if (width >= height && width > maxSize) {
								var factor = maxSize / width;
								height *= factor;
								width = maxSize;
							}
							else if (height > width && height > maxSize) {
								var factor = maxSize / height;
								width *= factor;
								height = maxSize;
							}
						}
						canvas.width = width;
						canvas.height = height;
						canvas.getContext('2d').drawImage(image, 0, 0, width, height);
						// try to retrieve as the original format
						var dataUrl = canvas.toDataURL(file.type ? file.type : "image/jpeg");
						applyUrl(dataUrl);
					};
					image.src = readerEvent.target.result;
				}
				else {
					applyUrl(readerEvent.target.result);
				}
			};
			reader.readAsDataURL(file);
		},
		urlToBlob: function(dataURL) {
			var BASE64_MARKER = ';base64,';
			if (dataURL.indexOf(BASE64_MARKER) < 0) {
				var parts = dataURL.split(',');
				var contentType = parts[0].split(':')[1];
				var raw = parts[1];
				return new Blob([raw], {type: contentType});
			}
			else {
				var parts = dataURL.split(BASE64_MARKER);
				var contentType = parts[0].split(':')[1];
				return this.base64ToBlob(parts[1], contentType);
			}
		},
		base64ToBlob: function(base, contentType) {
			var raw = window.atob(base);
			var rawLength = raw.length;
			var uInt8Array = new Uint8Array(rawLength);
			for (var i = 0; i < rawLength; ++i) {
				uInt8Array[i] = raw.charCodeAt(i);
			}
			return new Blob([uInt8Array], {type: contentType});
		},
		processImages: function(imagesToProcess) {
			var self = this;
			if (!(imagesToProcess instanceof Array)) {
				imagesToProcess = [imagesToProcess];
			}
			imagesToProcess.forEach(function(image) {
				if (image.$url == null && self.field.binary && image instanceof Blob) {
					var reader = new FileReader();
					reader.onload = function(event) { 
						Vue.set(image, "$url", event.target.result);
					}
					reader.readAsDataURL(image);
					if (self.selectedImage == null) {
						self.selectedImage = image;
					}
				}
				// if our content is already base64 encoded, it is likely from the backend
				else if (image.$url == null && image[self.contentField] != null && typeof(image[self.contentField]) == "string") {
					image.$url = "data:" + image[self.typeField] + ";base64," + image[self.contentField];
					image[self.contentField] = self.base64ToBlob(image[self.contentField], image[self.typeField]);
					if (self.selectedImage == null) {
						self.selectedImage = image;
					}
				}
				else if (image.$url == null && image[self.contentField] != null && image[self.contentField] instanceof Blob) {
					var reader = new FileReader();
					reader.onload = function(event) { 
						Vue.set(image, "$url", event.target.result);
					}
					reader.readAsDataURL(image[self.contentField]);
					if (self.selectedImage == null) {
						self.selectedImage = image;
					}
				}
				else if (image.$url != null && self.selectedImage == null) {
					self.selectedImage = image;
				}
			});
		}
	}
});

window.addEventListener("load", function() {
	application.bootstrap(function($services) {
		nabu.page.provide("page-form-list-input", { 
			component: "n-form-image-uploader", 
			configure: "n-form-image-uploader-configure", 
			name: "image-uploader",
			namespace: "nabu.page"
		});
		nabu.page.provide("page-form-input", { 
			component: "n-form-image-uploader", 
			configure: "n-form-image-uploader-configure", 
			name: "image-uploader",
			namespace: "nabu.page"
		});
		$services.router.register({
			alias: "page-form-image-uploader",
			enter: function(parameters) {
				var cloneParameters = {};
				nabu.utils.objects.merge(cloneParameters, parameters);
				cloneParameters.formComponent = "n-form-image-uploader";
				cloneParameters.configurationComponent = "n-form-image-uploader-configure";
				return new nabu.page.views.FormComponent({propsData: cloneParameters});
			},
			form: "imageUploader",
			category: "Form",
			name: "Image uploader",
			description: "Uploads images and can resize them",
			icon: "page/core/images/image.svg"
		});
	});
});
