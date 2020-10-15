<template id="n-form-radio">
	<div class="n-form-component n-form-radios" :class="[ mandatory ? 'n-form-input-required' : 'n-form-input-optional', { 'n-form-hidden': hide, 'n-form-disabled': disabled },{ 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }]" :optional="hide != null">
		
		<slot name="top"></slot>
		
		<div class="n-form-label-wrapper">
			<slot name="radios-label" :label="label" :mandatory="mandatory">
				<label class="n-form-label" :class="{ 'n-form-input-required': mandatory }" v-if="label">{{ label }}</label>
			</slot>
			<n-info class="n-form-component-description n-form-component-description-info" :icon="descriptionIcon" v-if="descriptionType == 'info'">{{ description }}</n-info>
		</div>
		
		<div class="n-form-component-description n-form-component-description-before"  v-if="before || descriptionType == 'before'">
			<span class="n-form-component-description-icon" :class="descriptionIcon" v-if="descriptionIcon"></span>
			<span class="n-form-component-description-label">{{ before ? before : description }}</span>
		</div>
		
		<div v-for="item in items" class="n-form-component n-form-radio" :class="{ 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }">
			<input ref="input" 
				type="radio" 
				:name="name"
				:disabled="!edit || disabled"
				:value="extracter ? extracter(item) : item"
				v-checked="(!mustChoose || chosen) && value == (extracter ? extracter(item) : item)"
				@input="select(item)"
				v-if="!hide" 
				class="n-form-radio-input"
			/><slot name="label" :select="function() { select(item) }"><label class="n-form-label" @click="select(item); $event.stopPropagation()">{{ formatter ? formatter(item) : item }}</label></slot>
		</div>

		<slot name="bottom"><n-messages :messages="messages" v-if="messages && messages.length"/></slot>
		
		<div class="n-form-component-description n-form-component-description-after" v-if="after || descriptionType == 'after'">
			<span class="n-form-component-description-icon" :class="descriptionIcon" v-if="descriptionIcon"></span>
			<span class="n-form-component-description-label">{{ after ? after : description }}</span>
		</div>		
		
	</div>
</template>
