<template id="n-form-combo">
	<div class="n-form-combo n-form-component">
	
		<slot name="label" :label="label" :mandatory="mandatory">
			<label class="n-form-label" :class="{ 'n-form-input-required': mandatory }" v-if="label">{{ label }}</label>
		</slot>
		<slot v-if="!edit">
			<span class="n-form-read">{{ valueLabel ? valueLabel : (formatter && value ? formatter(value) : value) }}</span>
		</slot>

		<n-input-combo v-show="edit" 
			:case-insensitive="caseInsensitive"
			@label="function(newValue) { valueLabel = newValue }"
			:value="value" 
			:labels="labels" 
			:filter="filter" 
			:formatter="formatter" 
			:class="{ 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }"
			@input="updateValue"
			:items="items"
			:nillable="nillable"
			:timeout="timeout"
			:autoclose="autoclose"
			:placeholder="placeholder"
			:disabled="disabled"
			:initial-label="initialLabel"
			:extracter="extracter"
			:resolver="resolver"
			v-bubble:label
			:name="name"
			:autocomplete="autocomplete"
			:autoselect-single="autoselectSingle"
			ref="combo">
		
			<div class="n-form-combo-bottom" slot="bottom">
				<span class="n-input-result n-icon n-icon-check fa fa-check" v-if="valid != null && valid && edit"></span>
				<span class="n-input-result n-icon n-icon-times fa fa-times" v-if="valid != null && !valid && edit"></span>
			</div>
			
		</n-input-combo>
		<slot name="bottom"><n-messages :messages="messages" v-if="messages && messages.length"/></slot>
	</div>
</template>
