Vue.component("n-form-barcode", {
	template: "#n-form-barcode",
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
		width: {
			type: Number,
			required: false,
			default: 640
		},
		height: {
			type: Number,
			required: false,
			default: 480
		},
		buttonLabel: {
			type: String,
			required: false
		},
		icon: {
			type: String,
			required: false
		},
		validator: {
			type: Function,
			required: false
		},
		// whether or not manual entry is allowed
		manualEntry: {
			type: Boolean,
			required: false
		},
		manualLabel: {
			type: String,
			required: false
		},
		decoders: {
			type: Array,
			required: false,
			default: function() {
				return ["code_128_reader"];
			}
		}
	},
	data: function() {
		return {
			code: null,
			failed: false,
			scanning: false,
			scanned: false
		}
	},
	created: function() {
		if (this.value) {
			this.code = this.value;
		}
	},
	beforeDestroy: function() {
		if (this.stop) {
			this.stop();
		}
	},
	computed: {
		definition: function() {
			var definition = nabu.utils.vue.form.definition(this);
			if (this.type == "number") {
				definition.type = "number";
			}
			return definition;
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	beforeDestroy: function() {
		this.stop();
	},
	methods: {
		stop: function() {
			Quagga.stop();
		},
		scan: function() {
			var self = this;
			var canvas = this.$refs.canvas;
			var context = canvas.getContext("2d");
			console.log("readers are", self.decoders);
			Quagga.init({
				inputStream : {
					name : "Live",
					type : "LiveStream",
					target: this.$refs.canvas    // Or '#yourElement' (optional)
				},
				locate: true,
				locator: {
					// with these settings you get the best results for everyday objects it seems
					halfSample: false,
					patchSize: "large", // x-small, small, medium, large, x-large,
					debug: {
						// searches for a canvas with id "debug"
						// doesn't really seem to do much though?
						showCanvas: false
					}
				},
				decoder : {
					readers: self.decoders
				}
			}, function(err) {
				if (err) {
					console.log(err);
					return
				}
				var onProcessed = function(result) {
					// clear the image (though probably not necessary because of next step)
					context.clearRect(0, 0, canvas.width, canvas.height);
					// take the image data from quagga and render it in the canvas
					var imageData = Quagga.canvas.ctx.image.getImageData(0, 0, Quagga.canvas.ctx.image.canvas.width, Quagga.canvas.ctx.image.canvas.height);
					context.putImageData(imageData, 0, 0);
					// if the result contains boxes, these are the parts quagga thinks might be a barcode, draw them
					if (result && result.boxes) {
						result.boxes.forEach(function (box) {
							Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, context, {color: "green", lineWidth: 2});
						});
					}
				};
				// draw the result
				Quagga.onProcessed(onProcessed);
				var onDetect = function(result) {
					self.code = result ? result.codeResult : null;
					Quagga.stop();
					Quagga.offDetect(onDetect);
					Quagga.offProcessed(onProcessed);
				};
				// once a result has been detected, stop scanning
				Quagga.onDetected(onDetect);
				// start quagga
				Quagga.start();
			});
		},
		checkEmpty: function(newValue) {
			if (!newValue) {
				this.rescan();
			}
		},
		validate: function(soft) {
			return this.$refs.text.validate(soft);
		}
	},
	watch: {
		code: function(newValue) {
			if (this.value != newValue) {
				this.$emit("input", newValue);
			}
		}
	}
});


