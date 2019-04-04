<template id="n-form-address">
	<div class="n-form-address n-form-component">
	
		<div class="n-form-address-form" v-if="edit">
			<n-form-combo :filter="searchField.bind($self, 'country')" v-if="country" 
				:label="countryLabel"
				:value="value[country]"
				@input="updateCountry"
				:timeout="300"
				:schema="schemaResolver ? schemaResolver(country) : null"
				:name="country"
				:formatter="formatAutocomplete.bind($self, 'country')"
				class="country"
				ref="country"/>
			
			<n-form-combo :filter="searchField.bind($self, 'city')" v-if="city" 
				:disabled="country && !value[country]"
				:label="cityLabel"
				:value="value[city]"
				@input="updateCity"
				:timeout="300"
				:formatter="formatAutocomplete.bind($self, 'city')"
				:schema="schemaResolver ? schemaResolver(city) : null"
				:name="city"
				class="city"
				ref="city"/>
			
			<n-form-combo :filter="searchField.bind($self, 'postCode')" v-if="postCode" 
				:disabled="(country && !value[country]) || (city && !value[city])"
				:label="postCodeLabel"
				:value="value[postCode]"
				@input="updatePostCode"
				:timeout="300"
				:formatter="formatAutocomplete.bind($self, 'postCode')"
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
				:disabled="(country && !value[country]) || (city && !value[city]) || (postCode && !value[postCode])" 
				:label="streetLabel"
				:value="value[street]"
				@input="updateStreet"
				:timeout="300"
				:formatter="formatAutocomplete.bind($self, 'street')"
				:schema="schemaResolver ? schemaResolver(street) : null"
				:name="street"
				class="street"
				ref="street"/>
			
			<n-form-combo :filter="searchField.bind($self, 'streetNumber')" v-if="streetNumber && false"
				:disabled="(country && !value[country]) || (city && !value[city]) || (postCode && !value[postCode]) || (street && !value[street])"  
				:label="streetNumberLabel"
				:value="value[streetNumber]"
				@input="updateStreetNumber"
				:timeout="300"
				:formatter="formatAutocomplete.bind($self, 'streetNumber')"
				:schema="schemaResolver ? schemaResolver(streetNumber) : null"
				:name="streetNumber"
				class="streetNumber"
				ref="streetNumber"/>
				
			<n-form-text v-else
				:disabled="(country && !value[country]) || (city && !value[city]) || (postCode && !value[postCode]) || (street && !value[street])"  
				:label="streetNumberLabel"
				:value="value[streetNumber]"
				@input="updateStreetNumber"
				:timeout="300"
				:schema="schemaResolver ? schemaResolver(streetNumber) : null"
				:name="streetNumber"
				class="streetNumber"
				ref="streetNumber"/>

		</div>
		<div v-else>
			<label v-if="label">{{label}}</label>
			<span class="n-form-read">{{ formattedAddress }}</span>
		</div>

	</div>
</template>