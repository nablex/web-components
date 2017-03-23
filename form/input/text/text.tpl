<template id="n-form-text">
	<div class="n-form-component n-form-text" :class="{ 'n-form-hidden': hide }" :optional="hide != null">
		<slot name="top"></slot>
		<slot name="label">
			<label class="n-form-label" :class="{ 'n-form-input-required': mandatory }" v-if="label">{{ label }}</label>
		</slot>
		<input 
			@input="updateValue($event.target.value)" 
			:placeholder="placeholder" 
			:type="type" 
			:disabled="disabled" 
			:value="value" 
			class="field" 
			v-if="edit" 
			:class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }"
			@focus="$emit('focus')"
			/><slot name="after-input"><span class="n-form-empty"></span></slot><span class="n-form-input-required" v-if="mandatory"></span>	
		
		<span class="n-input-result n-icon n-icon-check" v-if="valid != null && valid && edit"></span>
		<span class="n-input-result n-icon n-icon-times" v-if="valid != null && !valid && edit"></span>
		<slot v-if="!edit">
			<span class="n-form-read">{{ value }}</span>
		</slot>
		<slot name="bottom">
			<n-messages :messages="messages" v-if="messages && messages.length"/>
		</slot>
	</div>
</template>