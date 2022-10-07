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
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		width: {
			type: Number,
			required: false,
			default: 240
		},
		height: {
			type: Number,
			required: false,
			default: 200
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
		manualPlaceholder: {
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
			scanned: false,
			scaleSet: false
		}
	},
	created: function() {
		if (this.value) {
			this.code = this.value;
		}
	},
	beforeDestroy: function() {
		this.stop();
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
	methods: {
		stop: function() {
			if (this.stopper) {
				this.stopper();
				this.stopper = null;
				this.scanning = false;
			}
		},
		scan: function() {
			this.stop();
			this.scanning = true;
			var self = this;
			// let the v-show kick in to get the correct resize for canvas
			Vue.nextTick(function() {
				var canvas = self.$refs.canvas;
				var context = canvas.getContext("2d");
				self.$refs.video.width = canvas.offsetWidth;
				self.$refs.video.height = canvas.offsetHeight;
				// if you have F12 open, the canvas takes too much space
				// but this simple fix somehow fucked it up even further?
				//canvas.width = canvas.offsetWidth;
				//canvas.height = canvas.offsetHeight;
				Quagga.init({
					inputStream : {
						name : "Live",
						type : "LiveStream",
						target: self.$el
						//target: this.$refs.canvas    // Or '#yourElement' (optional)
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
						return;
					}
					var onProcessed = function(result) {
						// take the image data from quagga and render it in the canvas
						//var imageData = Quagga.canvas.ctx.image.getImageData(0, 0, Quagga.canvas.ctx.image.canvas.width, Quagga.canvas.ctx.image.canvas.height);
						//console.log("scale is", canvas.width / Quagga.canvas.ctx.image.canvas.width, canvas.height / Quagga.canvas.ctx.image.canvas.height);
						
						//context.scale(Quagga.canvas.ctx.image.canvas.width / canvas.width, Quagga.canvas.ctx.image.canvas.height / canvas.height);
						//context.putImageData(imageData, 0, 0);
						
						// only set scale once, it seems to build on top of the existing scale, not from an absolute 1, 1
						if (!self.scaleSet) {
							self.scaleSet = true;
							context.scale(canvas.width / Quagga.canvas.ctx.image.canvas.width, canvas.height / Quagga.canvas.ctx.image.canvas.height);
						}
						
						// because of scaling, we need to draw it bigger than the original canvas
						context.clearRect(0, 0, Quagga.canvas.ctx.image.canvas.width, Quagga.canvas.ctx.image.canvas.height);
						
						//context.fillStyle = "rgba(0, 0, 0, 0)";
						//context.fillRect(0, 0, canvas.offsetWidth, canvas.offsetWidth);
						
						// we can't use putImageData as that doesn't actually scale
						// we need to roundtrip to an image which does adhere to the scale
						/*var image = new Image();
						image.width = Quagga.canvas.ctx.image.canvas.width;
						image.height = Quagga.canvas.ctx.image.canvas.height;
						image.onload = function() {
							// we could easily scale the image itself by adding the canvas.width & height as additional parameters
							// however, we also want to scale the boxes being drawn below which is why we use the generic scaling
							context.drawImage(image, 0, 0);
						}
						image.src = Quagga.canvas.ctx.image.canvas.toDataURL();
						*/
						
						// if the result contains boxes, these are the parts quagga thinks might be a barcode, draw them
						if (result && result.boxes) {
							result.boxes.forEach(function (box) {
								Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, context, {color: "green", lineWidth: 2});
							});
						}
					};
					// draw the result
					Quagga.onProcessed(onProcessed);
					self.stopper = function(result) {
						self.code = result && result.codeResult ? result.codeResult.code : null;
						Quagga.stop();
						Quagga.offDetected(self.stopper);
						Quagga.offProcessed(onProcessed);
						self.scanning = false;
					};
					// once a result has been detected, stop scanning
					Quagga.onDetected(self.stopper);
					// start quagga
					Quagga.start();
					
				});
			})
		},
		drawFaster: function(processed) {
			var self = this;
			if (this.scanning) {
				setTimeout(function() {
					processed();
					self.drawFaster(processed);
				}, 30);
			}
		},
		checkEmpty: function(newValue) {
			if (!newValue) {
				this.rescan();
			}
		},
		validate: function(soft) {
			if (this.$refs.text) {
				return this.$refs.text.validate(soft);
			}
			else {
				// TODO: could do further validation checks at this point, we have stuff like mandatory etc
				return [];
			}
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



