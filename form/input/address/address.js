Vue.component("n-form-address", {
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
		schemaResolver: {
			type: Function,
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
		countryLabel: {
			type: String,
			required: false,
			default: "%{Country}"
		},
		// political or locality
		city: {
			type: String,
			required: false
		},
		cityLabel: {
			type: String,
			required: false,
			default: "%{City}"
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
		streetLabel: {
			type: String,
			required: false,
			default: "%{Street}"
		},
		// street_number
		streetNumber: {
			type: String,
			required: false
		},
		// street_number
		streetNumberLabel: {
			type: String,
			required: false,
			default: "%{Street Number}"
		},
		postCode: {
			type: String,
			required: false
		},
		postCodeLabel: {
			type: String,
			required: false,
			default: "%{Zip Code}"
		},
		formatted: {
			type: String,
			required: false
		}
		// street_address: down to an actual address
		// route: down to a street
	},
	template: "#n-form-address",
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
		},
		formattedAddress: function() {
			return "formatted!";
		}
	},
	created: function() {
		this.sessionToken = this.$services.geo.newSessionToken();
		
		// try to resolve an initial place
		var self = this;
		var geocoded = null;
		if (((this.country && this.value[this.country]) || (this.countryCode && this.value[this.countryCode])) && this.city && this.value[this.city]) {
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
		updateCountry: function(country) {
			this.updateCity(null);
			this.value[this.country] = this.formatAutocomplete('country', country);
			
			var self = this;
			// likely disabled!
			Vue.nextTick(function() {
				if (country) {
					if (self.city) {
						self.$refs.city.$el.querySelector("input").focus();
					}
					else if (self.postCode) {
						self.$refs.postCode.$el.querySelector("input").focus();
					}
					else if (self.street) {
						self.$refs.street.$el.querySelector("input").focus();
					}
				}
			});
		},
		updateCity: function(city) {
			this.updatePostCode(null);
			this.value[this.city] = this.formatAutocomplete('city', city);
			var self = this;
			Vue.nextTick(function() {
				if (city) {
					if (self.postCode) {
						self.$refs.postCode.$el.querySelector("input").focus();
					}
					else if (self.street) {
						self.$refs.street.$el.querySelector("input").focus();
					}
				}
			});
		},
		updatePostCode: function(postCode) {
			this.updateStreet(null);
			this.value[this.postCode] = this.formatAutocomplete('postCode', postCode);
			var self = this;
			Vue.nextTick(function() {
				if (postCode) {
					if (self.street) {
						self.$refs.street.$el.querySelector("input").focus();
					}
				}
			});
		},
		updateStreet: function(street) {
			this.updateStreetNumber(null);
			this.value[this.street] = this.formatAutocomplete('street', street);
			var self = this;
			Vue.nextTick(function() {
				if (street) {
					if (self.streetNumber) {
						self.$refs.streetNumber.$el.querySelector("input").focus();
					}
				}
			});
		},
		updateStreetNumber: function(streetNumber) {
			this.value[this.streetNumber] = this.formatAutocomplete('streetNumber', streetNumber);
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
		searchField: function(field, newValue) {
			var promise = this.$services.q.defer();
			var address = "";
			var types = []
			if (field == "country") {
				types.push("(regions)");
			}
			else if (field == "city") {
				types.push("(cities)");
			}
			else if (field == "postCode") {
				types.push("(regions)");
			}
			else if (field == "street") {
				types.push("address");
			}
			else if (field == "streetNumber") {
				types.push("address");
			}
			// if we have a country field, that should always be filled in
			if (this.country) {
				address = field == "country" ? newValue : this.value[this.country];
			}
			if (field != "country") {
				if (this.city && (field == "city" || this.value[this.city])) {
					var city = field == "city" ? newValue : this.value[this.city];
					if (field != "city" && this.postCode && (field == "postCode" || this.value[this.postCode])) {
						city = city + " " + (field == "postCode" ? newValue : this.value[this.postCode]);
					}
					address += ", " + city;
				}
				if (field != "city" && field != "postCode") {
					if (this.street && (field == "street" || this.value[this.street])) {
						var street = field == "street" ? newValue : this.value[this.street];
						if (field != "street" && this.streetNumber && (field == "streetNumber" || this.value[this.streetNumber])) {
							street += " " + (field == "streetNumber" ? newValue : this.value[this.streetNumber]);
						}
						address += ", " + street;
					}
				}
			}
			var self = this;
			this.searchPlace(address, types).then(function(resolved) {
				promise.resolve(resolved.filter(function(place) {
					if (field == "country") {
						return place.types.indexOf(field) >= 0;
					}
					else if (field == "city") {
						return place.types.indexOf("locality") >= 0 || place.types.indexOf("city") >= 0 || place.types.indexOf("sublocality") >= 0;
					}
					else if (field == "postCode") {
						return place.types.indexOf("postal_code") >= 0 || place.types.indexOf("locality") >= 0 || place.types.indexOf("sublocality") >= 0;
					}
					else if (field == "streetNumber") {
						return place.types.indexOf("address") >= 0;
					}
					return true;
				}));
			}, promise);
			return promise;
		},
		searchPlace: function(newValue, types) {
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
		},
		formatAutocomplete: function(field, place) {
			if (!place) {
				return null;
			}
			else if (typeof(place) == "string") {
				return place;
			}
			var self = this;
			// they tend to repeat terms in random order (perhaps depending on the type?)
			return place.terms.filter(function(term) {
				var term = term.value;
				if (field == "country") {
					return true;
				}
				else if (field == "city") {
					return self.country == null || term != self.value[self.country];
				}
				else if (field == "postCode") {
					return (self.country == null || term != self.value[self.country])
						&& (self.city == null || term != self.value[self.city]);
				}
				else if (field == "street") {
					return (self.country == null || term != self.value[self.country])
						&& (self.city == null || term != self.value[self.city])
						&& (self.postCode == null || term != self.value[self.postCode]);
				}
				else if (field == "streetNumber") {
					return (self.country == null || term != self.value[self.country])
						&& (self.city == null || term != self.value[self.city])
						&& (self.postCode == null || term != self.value[self.postCode])
						&& (self.street == null || term != self.value[self.street]);
				}
			})[0].value;
			// the postcode might return "Deurne, 2100"
			var parts = place.structured_formatting.main_text.split(",");
			return parts[parts.length - 1];
		}
	}
});