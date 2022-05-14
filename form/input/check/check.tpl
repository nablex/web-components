<template id="n-form-checkbox">
	<div :class="[component, { 'is-hidden': hide, 'is-disabled': disabled, 'is-valid': valid != null && valid, 'is-invalid': valid != null && !valid, 'is-required': mandatory, 'is-optional': !mandatory, 'is-order-reverse': labelBefore }]" :optional="hide != null">
		<slot name="before" :content="before">
			<div class="is-content-before" v-if="before" v-html="before"></div>
		</slot>
		<div class="is-content-wrapper">
			<input ref="input" 
				@click="toggleValue()" 
				type="checkbox" 
				v-checked="calculatedValue" 
				:disabled="!edit || disabled" 
				:value="calculatedValue"
				:name="name"
				v-if="!hide" 
				class="is-input"
			/><label  
				@click="toggleValue(); $event.stopPropagation()" 
				class="is-label" 
				><span class="is-label-content" v-html="label"></span><n-info :icon="infoIcon" v-if="info"><span v-html="info"></span></n-info></label>
		</div>
		<slot name="messages" :messages="messages">
			<n-messages :messages="messages" v-if="messages && messages.length"/>
		</slot>
		<slot name="after" :content="after">
			<div class="is-content-after" v-if="after" v-html="after"></div>
		</slot>
	</div>
</template>

