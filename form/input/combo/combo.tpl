<template id="n-form-combo">
	<div class="n-form-combo n-form-component" :class="[mandatory ? 'n-form-input-required' : 'n-form-input-optional',{ 'n-form-invalid': valid != null && !valid },{ 'n-form-valid': valid != null && valid }]">
		
		<div class="n-form-label-wrapper" v-if="label || info || descriptionType == 'info'">
				<slot name="label" :label="label" :mandatory="mandatory">
					<label class="n-form-label" :class="{ 'n-form-input-required': mandatory }" v-if="label" v-html="label"></label>
				</slot>
			<n-info class="n-form-component-description n-form-component-description-info" :icon="descriptionIcon" v-if="info || descriptionType == 'info'"><span v-html="info ? info : description"></span></n-info>
		</div>		


		<div class="n-form-component-before n-form-component-description n-form-component-description-before"  v-if="before || descriptionType == 'before'">
			<span class="n-form-component-description-icon" :class="descriptionIcon" v-if="descriptionIcon"></span>
			<span class="n-form-component-description-label">{{ before ? before : description }}</span>
		</div>
		
		<slot v-if="!edit">
			<span class="n-form-read">{{ valueLabel ? valueLabel : (formatter && value ? formatter(value) : value) }}</span>
		</slot>

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
			:name="name"
			:autocomplete="autocomplete"
			:autoselect-single="autoselectSingle"
			:descriptionIcon="descriptionIcon"
			:description="description"
			:descriptionType="descriptionType"
			ref="combo">
		
			<div class="n-form-combo-bottom" slot="bottom">
				<span class="n-input-result n-icon n-icon-check fa fa-check" v-if="valid != null && valid && edit"></span>
				<span class="n-input-result n-icon n-icon-times fa fa-times" v-if="valid != null && !valid && edit"></span>
			</div>
		</n-input-combo>

		<slot name="bottom"><n-messages :messages="messages" v-if="messages && messages.length"/></slot>
		
		<div class="n-form-component-after n-form-component-description n-form-component-description-after" v-if="after || descriptionType == 'after'">
			<span class="n-form-component-description-icon" :class="descriptionIcon" v-if="descriptionIcon"></span>
			<span class="n-form-component-description-label">{{ after ? after : description }}</span>
		</div>		
		
	</div>
</template>
