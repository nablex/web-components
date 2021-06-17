test
// need to import the following url: https://maps.googleapis.com/maps/api/js?key=<apikey>&libraries=places&callback=application.services.geo.initialize
Vue.service("geo", {
	data: function() {
		return {
			geocoder: null,
			autocompleter: null,
			placer: null
		}
	},
	methods: {
		initialize: function() {
			console.log("initializing geo");	
		},
		// must provide at least
		// - address: a string name to geocode
		// - location: a LatLng object
		// - placeId: a place id
		geocode: function(parameters) {
			if (!this.geocoder) {
				this.geocoder = new google.maps.Geocoder();
			}

			var promise = this.$services.q.defer();
			this.geocoder.geocode(parameters, function (results, status) {
				if (status === "OK") {
					promise.resolve(results);
				}
				else {
					promise.reject(status);
				}
			});
			return promise;
		},
		// the language is the one set in the browser, there seems to be no way to modify this language here
		// it is possible (but not validated) that you can set the language in the initial google script include as a query parameter
		autocomplete: function(input, parameters) {
			if (!this.autocompleter) {
				this.autocompleter = new google.maps.places.AutocompleteService();
			}
			if (!parameters) {
				parameters = {};
			}
			parameters.input = input;
			
			if (!parameters.sessionToken) {
				parameters.sessionToken = this.newSessionToken();
			}
			
			var promise = this.$services.q.defer();
			this.autocompleter.getPlacePredictions(parameters, function(results, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					promise.resolve(results);
				}
				else {
					promise.reject(status);
				}
			});
			return promise;
		},
		newSessionToken: function() {
			return new google.maps.places.AutocompleteSessionToken();
		}
	}
});
