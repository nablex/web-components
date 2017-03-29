<template id="n-form-checkbox">
	<div class="n-form-component n-form-checkbox" :class="{ 'n-form-hidden': hide, 'n-form-disabled': disabled }" :optional="hide != null">
		<slot name="top"></slot>
		<slot name="label"><span class="n-form-label" v-if="label">{{ label }}</span></slot>
		<input ref="input" @click="toggleValue()" type="checkbox" v-checked="calculatedValue" :disabled="!edit || disabled" :value="calculatedValue" v-if="!hide" :class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }" class="n-form-checkbox-input"/>
		<slot name="overlay" :toggle="toggleValue"><label @click="toggleValue($event)" class="n-form-checkbox-label"></label></slot>
	</div>
</template>