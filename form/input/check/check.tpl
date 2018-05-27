<template id="n-form-checkbox">
	<div class="n-form-component n-form-checkbox" :class="{ 'n-form-hidden': hide, 'n-form-disabled': disabled, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }" :optional="hide != null">
		<slot name="top"></slot>
		<input ref="input" 
			@click="toggleValue()" 
			type="checkbox" 
			v-checked="calculatedValue" 
			:disabled="!edit || disabled" 
			:value="calculatedValue"
			:name="name"
			v-if="!hide" 
			class="n-form-checkbox-input"
		/><slot name="label" :toggle="toggleValue"><label class="n-form-label" @click="toggleValue(); $event.stopPropagation()" v-if="label"
			:class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory }">{{ label }}</label></slot>
	</div>
</template>