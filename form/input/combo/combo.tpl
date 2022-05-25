<template id="n-form-combo">
	<div class="is-form-combo" :class="[mandatory ? 'n-form-input-required' : 'n-form-input-optional',{ 'n-form-invalid': valid != null && !valid },{ 'n-form-valid': valid != null && valid }]">
		
		<div class="is-label-wrapper" v-if="label || info">
			<label class="is-label" v-if="label"><span class="is-label-content" v-html="label"></span><n-info :icon="infoIcon" v-if="info"><span v-html="info"></span></n-info></label>
		</div>

		<div class="is-content-before" v-if="before" v-html="before"></div>
		
		<div class="is-content-wrapper" v-if="edit">
			<slot name="prefix"><div class="is-prefix" v-if="prefix" v-html="prefix"></div></slot>
			<n-input-combo v-show="edit" 
				:empty-value="emptyValue"
				:reset-value="resetValue"
				:calculating-value="calculatingValue"
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
				:allow-typing="allowTyping"
				:extracter="extracter"
				:resolver="resolver"
				v-bubble:label
				@keyup="$emit('keyup', $event)"
				@keydown="$emit('keydown', $event)"
				:name="name"
				:autocomplete="autocomplete"
				:autoselect-single="autoselectSingle"
				:descriptionIcon="descriptionIcon"
				:description="description"
				:descriptionType="descriptionType"
				ref="combo">
			</n-input-combo>
			<slot name="suffix"><div class="is-suffix" v-if="suffix" v-html="suffix"></div></slot>
		</div>
		<slot v-else class="is-read-only">
			<span class="is-readable">{{ valueLabel ? valueLabel : (formatter && value ? formatter(value) : value) }}</span>
		</slot>

		<n-messages :messages="messages" v-if="messages && messages.length"/>
		<div class="is-content-after" v-if="after" v-html="after"></div>	
		
	</div>
</template>
