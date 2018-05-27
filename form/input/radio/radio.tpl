<template id="n-form-radio">
	<div class="n-form-components n-form-radios" :class="{ 'n-form-hidden': hide, 'n-form-disabled': disabled }" :optional="hide != null">
		<slot name="top"></slot>
		<div v-for="item in items" class="n-form-component n-form-radio">
			<input ref="input" 
				type="radio" 
				:name="name"
				:disabled="!edit || disabled"
				:value="extracter ? extracter(item) : item"
				v-checked="value == (extracter ? extracter(item) : item)"
				@input="select(item)"
				v-if="!hide" 
				:class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }" 
				class="n-form-radio-input"
			/><slot name="label" :select="function() { select(item) }"><label class="n-form-label" @click="select(item); $event.stopPropagation()">{{ formatter ? formatter(item) : item }}</label></slot>
		</div>
	</div>
</template>