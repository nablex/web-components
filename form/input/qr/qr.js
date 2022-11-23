// for the zoom, referenced from: https://stackoverflow.com/questions/62336847/video-mediadevices-getusermedia-zoom-is-not-working-in-ios
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
		buttonLabel: {
			type: String,
			required: false
		},
		manualLabel: {
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
		zoom: {
			type: Boolean,
			default: false
		},
		// whether or not you want to switch to viewing the actual qr code rather than the last still
		switchQrCode: {
			type: Boolean,
			default: false
		},
		buttonClass: {
			required: false
		}
	},
	data: function() {
		return {
			code: null,
			failed: false,
			scanning: false,
			scanned: false,
			zoomLevel: 0,
			zoomCapable: false,
			zoomMin: 0,
			zoomMax: 0,
			zoomStep: 0,
			canvasWidth: null,
			canvasHeight: null,
			cwidth: 0,
			cheight: 0,
			messages: [],
			valid: null
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
			return nabu.utils.vue.form.definition(this);
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		},
		zoomable: function() {
			return this.zoom && this.zoomCapable;
		},
		hasQrRenderer: function() {
			console.log("qr rendering", this.$services.swagger.operations, this.$services.swagger.operations["nabu.libs.misc.qr.web.render"]);
			return this.$services.swagger.operations["nabu.libs.misc.qr.web.render"] != null;
		}
	},
	ready: function() {
		this.resize();
	},
	methods: {
		resize: function() {
			var width = this.$el.offsetWidth;
			var height = (width * 2) / 3;
			this.$refs.canvas.style.width = width + "px";
			this.$refs.canvas.style.height = height + "px";
			this.$refs.overlay.style.width = width + "px";
			this.$refs.overlay.style.height = height + "px";
			this.$refs.canvas.setAttribute("width", width);
			this.$refs.canvas.setAttribute("height", height);
		},
		scan: function() {
			this.video = document.createElement("video");
			var video = this.video;
			var canvas = this.$refs.canvas;
			var context = canvas.getContext("2d");
			this.context = context;
			var self = this;
			// Use facingMode: environment to attempt to get the front camera on phones
			navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
				var track = stream.getVideoTracks()[0];
				var capabilities = track && track.getCapabilities ? track.getCapabilities() : {};
				console.log("capabilities are", capabilities);
				if (Object.keys(capabilities).indexOf("zoom") >= 0) {
					var settings = track.getSettings();
					self.zoomMin = capabilities.zoom.min;
					self.zoomMax = capabilities.zoom.max;
					self.zoomMax = capabilities.zoom.max;
					self.zoomLevel = settings.zoom;
					self.zoomCapable = true;
					self.$watch("zoomLevel", function(level) {
						console.log("zoom level updated to", level);
						track.applyConstraints({advanced: [ {zoom: level }]});
					});
				}
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
				
				// retain for other purposes
				this.canvasWidth = canvas.width;
				this.canvasHeight = canvas.height;

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
			var self = this;
			this.messages.splice(0);
			// this performs all basic validation and enriches the messages array to support asynchronous
			var messages = nabu.utils.schema.json.validate(this.definition, this.value, this.mandatory);
			self.messages.splice(0);
			var hardMessages = messages.filter(function(x) { return !x.soft });
			// if we are doing a soft validation and all messages were soft, set valid to unknown
			if (soft && hardMessages.length == 0 && (messages.length > 0 || !this.value) && self.valid == null) {
				self.valid = null;
			}
			else {
				self.valid = messages.length == 0;
				nabu.utils.arrays.merge(self.messages, nabu.utils.vue.form.localMessages(self, messages));
			}
			return messages;
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


