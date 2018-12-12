<template id="n-form-ean">
	<div class="n-form-component n-form-ean" :class="[{ 'n-form-hidden': hide }]" :optional="hide != null">
		<slot name="top"></slot>
		<slot name="label" :label="label" :mandatory="mandatory">
			<label class="n-form-label" :class="{ 'n-form-input-required': mandatory }" v-if="label">{{ label }}</label>
		</slot>
		<input 
			@input="updateValue($event.target.value)" 
			:placeholder="placeholder" 
			:disabled="disabled" 
			:value="value" 
			class="field"
			v-if="edit" 
			:class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }"
			@focus="focus"
			ref="input"
			:name="name"
			/>
		<slot name="after-input"><span class="n-form-empty"></span></slot><span class="n-form-input-required" v-if="mandatory"></span><span class="n-form-input-optional" v-if="!mandatory"></span>	
		<span class="n-input-result n-icon n-icon-check fa fa-check" v-if="valid != null && valid && edit"></span>
		<span class="n-input-result n-icon n-icon-times fa fa-times" v-if="valid != null && !valid && edit"></span>
		<slot v-if="!edit">
			<span class="n-form-read">{{ value }}</span>
		</slot>
		<slot name="bottom">
			<n-messages :messages="messages" v-if="messages && messages.length"/>
		</slot>
	</div>
</template>
