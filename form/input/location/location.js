Vue.component("n-form-location", {
	props: {
		value: {
			required: false
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
		disabled: {
			type: Boolean,
			required: false
		},
		validator: {
			type: Function,
			required: false
		},
		timeout: {
			type: Number,
			required: false
		},
		// the two letter code of the country
		countryRestriction: {
			type: String,
			required: false
		},
		allowEstablishments: {
			type: Boolean,
			required: false
		},
		allowCities: {
			type: Boolean,
			required: false
		},
		allowRegions: {
			type: Boolean,
			required: false
		},
		// allow for vague addresses
		allowVague: {
			type: Boolean,
			required: false
		},
		allowStreet: {
			type: Boolean,
			required: false
		},
		// latBottomLeft,longBottomLeft;latTopRight,longTopRight
		bounds: {
			type: String,
			required: false
		},
		// lat,long;radiusInMeters
		bias: {
			type: String,
			required: false
		},
		
		// the fields
		// geometry.location.lat
		latitude: {
			type: String,
			required: false
		},
		// geometry.location.long
		longitude: {
			type: String,
			required: false
		},
		// country
		country: {
			type: String,
			required: false
		},
		// countryCode (2 letter ISO)
		countryCode: {
			type: String,
			required: false
		},
		// political or locality
		city: {
			type: String,
			required: false
		},
		// administrative_area_level_2
		province: {
			type: String,
			required: false
		},
		// administrative_area_level_1
		region: {
			type: String,
			required: false
		},
		// route
		street: {
			type: String,
			required: false
		},
		streetIncludeNumber: {
			type: Boolean,
			required: false
		},
		// street_number
		streetNumber: {
			type: String,
			required: false
		},
		postCode: {
			type: String,
			required: false
		},
		formatted: {
			type: String,
			required: false
		}
		// street_address: down to an actual address
		// route: down to a street
	},
	template: "#n-form-location",
	data: function() {
		return {
			timer: null,
			place: null,
			sessionToken: null,
			resolvedType: null
		};
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
	created: function() {
		this.sessionToken = this.$services.geo.newSessionToken();
		
		// try to resolve an initial place
		var self = this;
		var geocoded = null;
		if (this.formatted && this.value[this.formatted]) {
			geocoded = this.$services.geo.geocode({
				address: this.value[this.formatted]
			});
		}
		else if (((this.country && this.value[this.country]) || (this.countryCode && this.value[this.countryCode])) && this.city && this.value[this.city]) {
			var address = "";
			if (this.country && this.value[this.country]) {
				address += this.value[this.country];
			}
			else if (this.countryCode && this.value[this.countryCode]) {
				address += this.value[this.countryCode];
			}
			if (this.city && this.value[this.city]) {
				address = this.value[this.city] + ", " + address;
			}
			if (this.street && this.value[this.street]) {
				var street = this.value[this.street];
				if (this.streetNumber && this.value[this.streetNumber]) {
					street += " " + this.value[this.streetNumber];
				}
				address = street + ", " + address;
			}
			geocoded = this.$services.geo.geocode({
				address: address
			});
		}
		else if (this.latitude && this.longitude && this.value[this.longitude] && this.value[this.latitude]) {
			geocoded = this.$services.geo.geocode({
				location: new google.maps.LatLng({ lat: parseFloat(this.value[this.latitude]), lng: parseFloat(this.value[this.longitude]) })
			});
		}
		if (geocoded != null) {
			geocoded.then(function(place) {
				if (place instanceof Array) {
					place = place[0];
				}
				place.description = place.formatted_address;
				self.place = place;
			});
		}
	},
	methods: {
		getPart: function(place, parts, short) {
			if (!(parts instanceof Array)) {
				parts = [parts];
			}
			var result = null;
			parts.forEach(function(part) {
				if (result == null) {
					result = place.address_components.filter(function(x) { return x.types.indexOf(part) >= 0})[0];
				}
			});
			return result ? (short ? result.short_name : result.long_name) : result;
		},
		validate: function(soft) {
			this.$refs.combo.messages.splice(0);
			var messages = nabu.utils.schema.json.validate(this.definition, this.resolvedType, this.mandatory);
			// only validate if we have resolved something, otherwise the required boolean will pick it up
			if (this.resolvedType) {
				if (!this.allowVague && this.resolvedType != "street_address") {
					messages.push({
						code: "vague",
						title: "%{validation:The address is not specific enough}",
						component: this,
						context: [],
						severity: "error",
						values: {
							expected: "street_address",
							actual: this.resolvedType
						}
					});
				}
			}
			var hardMessages = messages.filter(function(x) { return !x.soft });
			// if we are doing a soft validation and all messages were soft, set valid to unknown
			if (soft && hardMessages.length == 0 && messages.length > 0 && this.$refs.combo.valid == null) {
				this.$refs.combo.valid = null;
				// remove local messages
				this.messages.splice(0);
			}
			else {
				this.$refs.combo.valid = messages.length == 0;
				nabu.utils.arrays.merge(this.$refs.combo.messages, nabu.utils.vue.form.localMessages(this, messages));
			}
			return messages;
		},
		update: function(value) {
			if (this.$refs.combo) {
				this.$refs.combo.messages.splice(0);
				this.$refs.combo.valid = null;
			}
			var self = this;
			if (value && value.place_id) {
				var handler = function(place) {
					if (place instanceof Array) {
						place = place[0];
					}
					self.place = place;
					self.resolvedType = place.types[0];
					if (self.country) {
						self.value[self.country] = self.getPart(place, ["country"]);
					}
					if (self.countryCode) {
						self.value[self.countryCode] = self.getPart(place, ["country"], true);
					}
					if (self.province) {
						self.value[self.province] = self.getPart(place, ["administrative_area_level_2"]);
					}
					if (self.region) {
						self.value[self.region] = self.getPart(place, ["administrative_area_level_1"]);
					}
					if (self.city) {
						self.value[self.city] = self.getPart(place, ["sublocality", "locality"]);
					}
					if (self.postCode) {
						self.value[self.postCode] = self.getPart(place, ["postal_code"]);
					}
					if (self.street) {
						self.value[self.street] = self.getPart(place, ["route"]);
						if (self.streetIncludeNumber) {
							var number = self.getPart(place, "street_number");
							if (number != null && self.value[self.street] != null) {
								self.value[self.street] += " " + number;
							}
						}
					}
					if (self.streetNumber) {
						self.value[self.streetNumber] = self.getPart(place, ["street_number"]);
					}
					if (self.formatted) {
						self.value[self.formatted] = place.formatted_address;
					}
					if (self.latitude && place.geometry) {
						self.value[self.latitude] = place.geometry.location.lat instanceof Function ? place.geometry.location.lat() : place.geometry.location.lat;
					}
					if (self.longitude && place.geometry) {
						self.value[self.longitude] = place.geometry.location.lng instanceof Function ? place.geometry.location.lng() : place.geometry.location.lng;
					}
					self.$emit("label", self.formatPlace(place));
				};
				this.$services.geo.geocode({placeId: value.place_id}).then(handler, function() {
					if (value.description) {
						self.$services.geo.geocode({address: value.description }).then(handler);
					}
				});
			}
		},
		searchPlace: function(newValue) {
			if (newValue) {
				var promise = this.$services.q.defer();
				
				var parameters = {
					sessionToken: this.sessionToken
				};
				
				var restrictions = {};
				if (this.countryRestriction) {
					parameters.componentRestrictions = {
						country: this.countryRestriction.toUpperCase().split(",")
					}
				}
				var types = [];
				if (!this.allowVague) {
					types.push("address");
				}
				else {
					if (this.allowRegions) {
						types.push("regions");
					}
					if (this.allowCities) {
						types.push("cities");
					}
				}
				if (this.allowEstablishments) {
					types.push("establishment");
				}
				
				parameters.types = types;
				
				if (this.bias) {
					var parts = this.bias.split(";");
					var subparts = parts[0].split(",");
					parameters.location = new google.maps.LatLng({ lat: subparts[0], lng: subparts[1] })
					if (parts.length >= 2) {
						parameters.radius = parts[1];
					}
				}
				
				if (this.bounds) {
					var parts = this.bias.split(";");
					var subparts1 = parts[0].split(",");
					var subparts2 = parts[1].split(",");
					parameters.bounds = new google.maps.LatLngBounds(
						new google.maps.LatLng({ lat: subparts1[0], lng: subparts1[1] }),
						new google.maps.LatLng({ lat: subparts2[0], lng: subparts2[1] })
					);
				}
				
				return this.$services.geo.autocomplete(newValue, parameters);
			}
			else {
				return this.$services.q.resolve([]);
			}
		},
		formatPlace: function(place) {
			return place.formatted_address ? place.formatted_address : place.description;
		}
	}
});