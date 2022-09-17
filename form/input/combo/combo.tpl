<template id="n-form-combo">
	<div class="is-form-combo" :class="[mandatory ? 'is-required' : 'is-optional',{ 'is-invalid': valid != null && !valid },{ 'is-valid': valid != null && valid }]">
		
		<div class="is-label-wrapper" v-if="label || info">
			<label class="is-label" v-if="label"><span class="is-label-content" v-html="label"></span><n-info :icon="infoIcon" v-if="info"><span v-html="info"></span></n-info></label>
		</div>

		<div class="is-content-before" v-if="before" v-html="before"></div>
		
		<div class="is-content-wrapper" v-if="edit">
			<slot name="prefix"><div class="is-prefix" v-if="prefix || prefixIcon"><icon v-if="prefixIcon" :name="prefixIcon"/><span class="is-text" v-html="prefix" v-if="prefix"></span></div></slot>
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
				:pretty-formatter="prettyFormatter"
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
				:allow-type-match="allowTypeMatch"
				ref="combo">
			</n-input-combo>
			<slot name="suffix"><div class="is-suffix" v-if="suffix || suffixIcon"><icon v-if="suffixIcon" :name="suffixIcon"/><span class="is-text" v-html="suffix"></span></div></slot>
		</div>
		<slot v-else class="is-read-only">
			<span class="is-readable">{{ valueLabel ? valueLabel : (formatter && value ? formatter(value) : value) }}</span>
		</slot>

		<n-messages :messages="messages" v-if="messages && messages.length"/>
		<div class="is-content-after" v-if="after" v-html="after"></div>	
		
	</div>
</template>
