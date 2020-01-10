<template id="n-form-address">
	<div class="n-form-address n-form-component">
	
		<div class="n-form-address-form" v-if="edit">
			<n-form-combo :filter="searchField.bind($self, 'country')" v-if="countryField" 
				:label="countryLabel"
				:value="value[countryField]"
				@input="updateCountry"
				:timeout="timeout"
				:allow-type-match="false"
				:schema="schemaResolver ? schemaResolver(country ? country : countryCode) : null"
				:name="country"
				:formatter="formatAutocomplete.bind($self, 'country')"
				class="country"
				ref="country"/>

			<n-form-combo :filter="searchField.bind($self, 'city')" v-if="city" 
				:disabled="countryField && !value[countryField]"
				:label="cityLabel"
				:value="value[city]"
				@input="updateCity"
				:timeout="timeout"
				:allow-type-match="false"
				:formatter="formatAutocomplete.bind($self, 'city')"
				:schema="schemaResolver ? schemaResolver(city) : null"
				:name="city"
				class="city"
				ref="city"/>
			
			<n-form-combo :filter="searchField.bind($self, 'postCode')" v-if="postCode" 
				:disabled="(countryField && !value[countryField]) || (city && !value[city])"
				:label="postCodeLabel"
				:value="value[postCode]"
				@input="updatePostCode"
				:timeout="timeout"
				:allow-type-match="false"
				:formatter="formatAutocomplete.bind($self, 'postCodeFull')"
				:schema="schemaResolver ? schemaResolver(postCode) : null"
				:name="postCode"
				class="postCode"
				ref="postCode"/>
				
			<n-form-text :disabled="true"
				v-else-if="postCode"
				:label="postCodeLabel"
				:value="value[postCode]"
				class="postCode"/>
			
			<n-form-combo :filter="searchField.bind($self, 'street')" v-if="street"
				:disabled="(countryField && !value[countryField]) || (city && !value[city]) || (postCode && !value[postCode])" 
				:label="streetLabel"
				:value="value[street]"
				@input="updateStreet"
				:timeout="timeout"
				:allow-type-match="false"
				:formatter="formatAutocomplete.bind($self, 'street')"
				:schema="schemaResolver ? schemaResolver(street) : null"
				:name="street"
				class="street"
				ref="street"/>
			
			<n-form-combo :filter="searchField.bind($self, 'streetNumber')" v-if="streetNumber && false"
				:disabled="(countryField && !value[countryField]) || (city && !value[city]) || (postCode && !value[postCode]) || (street && !value[street])"  
				:label="streetNumberLabel"
				:value="value[streetNumber]"
				@input="updateStreetNumber"
				:timeout="timeout"
				:allow-type-match="false"
				:formatter="formatAutocomplete.bind($self, 'streetNumber')"
				:schema="schemaResolver ? schemaResolver(streetNumber) : null"
				:name="streetNumber"
				class="streetNumber"
				ref="streetNumber"/>
				
			<n-form-text v-else-if="streetNumber"
				:disabled="(countryField && !value[countryField]) || (city && !value[city]) || (postCode && !value[postCode]) || (street && !value[street])"  
				:label="streetNumberLabel"
				:value="value[streetNumber]"
				@input="updateStreetNumber"
				:timeout="timeout"
				:allow-type-match="false"
				:schema="schemaResolver ? schemaResolver(streetNumber) : null"
				:name="streetNumber"
				class="streetNumber"
				ref="streetNumber"/>

		</div>
		<div v-else>
			<div class="n-form-label-wrapper">
				<label v-if="label" class="n-form-label" :class="{'n-form-input-required': anyRequired, 'n-form-input-optional': !anyRequired}">{{label}}</label>
			</div>
			<span class="n-form-read">{{ formattedAddress }}</span>
		</div>

	</div>
</template>

