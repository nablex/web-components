Vue.component("n-form-qr", {
	template: "#n-form-qr",
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
		manualLabel: {
			type: String,
			required: false
		},
		validator: {
			type: Function,
			required: false
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
		console.log("destroying video", this.stop);
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
	methods: {
		scan: function() {
			this.video = document.createElement("video");
			var video = this.video;
			var canvas = this.$refs.canvas;
			var context = canvas.getContext("2d");
			this.context = context;
			var self = this;
			// Use facingMode: environment to attemt to get the front camera on phones
			navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
				self.scanning = true;
				video.srcObject = stream;
				video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
				video.play();
				requestAnimationFrame(self.tick.bind(self, context));
				self.stop = function() {
					stream.getTracks().forEach(function(track) {
						track.stop();
					});
				}
			}, function() {
				self.failed = true;
			});
		},
		rescan: function() {
			this.code = null;
			if (this.video) {
				this.scanning = true;
				requestAnimationFrame(this.tick.bind(this, this.context));
			}
			else {
				this.scan();
			}
		},
		drawLine: function(context, begin, end, color) {
			context.beginPath();
			context.moveTo(begin.x, begin.y);
			context.lineTo(end.x, end.y);
			context.lineWidth = 4;
			context.strokeStyle = color;
			context.stroke();
		},
		tick: function(context) {
			var video = this.video;
			var canvas = this.$refs.canvas;
			var overlay = this.$refs.overlay;
			if (video.readyState === video.HAVE_ENOUGH_DATA) {
				/*
				canvas.height = video.videoHeight;
				canvas.width = video.videoWidth;
				overlay.style.height = video.videoHeight + "px";
				overlay.style.width = video.videoWidth + "px";
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
				*/

				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
				
				var code = jsQR(imageData.data, imageData.width, imageData.height, {
					inversionAttempts: "dontInvert",
				});
				if (code) {
					this.drawLine(context, code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
					this.drawLine(context, code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
					this.drawLine(context, code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
					this.drawLine(context, code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
					this.code = code.data;
				}
			}
			if (!this.code) {
				requestAnimationFrame(this.tick.bind(this, context));
			}
			else {
				this.scanned = true;
				this.scanning = false;
			}
		},
		checkEmpty: function(newValue) {
			if (!newValue) {
				this.rescan();
			}
		},
		validate: function(soft) {
			this.$refs.text.validate(soft);
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


