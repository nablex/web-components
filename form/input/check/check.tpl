<template id="n-form-checkbox">
	<div class="n-form-component n-form-checkbox" :class="{ 'n-form-hidden': hide, 'n-form-disabled': disabled }" :optional="hide != null">
		<slot name="top"></slot>
		<slot name="label">
			<span class="n-form-label" v-if="label">{{ label }}</span>
		</slot>
		<input ref="input" @click="toggleValue()" type="checkbox" :checked="value" :disabled="!edit || disabled" :value="value" v-if="!hide" :class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }"/>
		<slot name="label" toggle="toggleValue">
			<label @click="toggleValue()" class="n-form-checkbox-label"></label>
		</slot>
		<slot name="bottom">
			<n-messages :messages="messages"/>
		</slot>
	</div>
</template>