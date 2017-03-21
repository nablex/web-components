<template id="n-form-text">
	<div class="n-form-component n-form-text" :class="{ 'n-form-hidden': hide }" :optional="hide != null">
		<slot name="top"></slot>
		<slot name="label">
			<span class="n-form-label" v-if="label">{{ label }}</span>
		</slot>
		<input @input="updateValue($event.target.value)" :placeholder="placeholder" :type="type" :disabled="disabled" :value="value" class="field" v-if="edit" :class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }"/>
		<slot v-if="!edit">
			<span class="n-form-read">{{ value }}</span>
		</slot>
		<slot name="bottom">
			<n-messages :messages="messages"/>
		</slot>
	</div>
</template>