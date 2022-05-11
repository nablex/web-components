<template id="n-form-checkbox">
	<div class="n-form-component n-form-checkbox is-form-checkbox" :class="{ 'n-form-hidden': hide, 'n-form-disabled': disabled, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid, 'is-valid': valid != null && valid, 'is-invalid': valid != null && !valid }" :optional="hide != null">
		<slot name="top"></slot>
		<slot name="before" :content="before">
			<div class="n-form-component-before is-form-content-before" v-if="before" v-html="before"></div>
		</slot>
		<div class="is-form-content">
			<input ref="input" 
				@click="toggleValue()" 
				type="checkbox" 
				v-checked="calculatedValue" 
				:disabled="!edit || disabled" 
				:value="calculatedValue"
				:name="name"
				v-if="!hide" 
				class="n-form-checkbox-input"
			/><label  
				@click="toggleValue(); $event.stopPropagation()" 
				class="n-form-label is-form-label" 
				:class="{ 'n-form-input-required': mandatory, 'n-form-optional': !mandatory, 'is-order-reverse': labelBefore, 'is-required': mandatory, 'is-optional': !mandatory }"><span v-html="label"></span><n-info :icon="infoIcon" class="n-form-label-info" v-if="info"><span v-html="info"></span></n-info></label>
		</div>
		<slot name="messages" :messages="messages">
			<n-messages :messages="messages" v-if="messages && messages.length"/>
		</slot>
		<slot name="after" :content="after">
			<div class="n-form-component-after is-form-content-after" v-if="after" v-html="after"></div>
		</slot>
		<slot name="bottom"></slot>
	</div>
</template>

