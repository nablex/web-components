<template id="n-form-radio">
	<div class="is-form-radio-list" :class="[{ 'is-required': mandatory, 'is-optional': !mandatory, 'is-hidden': hide, 'is-invalid': valid != null && !valid, 'is-valid': valid != null && valid, 'has-prefix': !!prefix, 'has-suffix': !!suffix, 'has-before': !!before, 'has-after': !!after, 'has-label': !!label, 'has-info': !!info }, type ? 'is-form-text-' + type : null ]">
		<div class="is-label-wrapper" v-if="label || info">
			<label class="is-label" v-if="label"><span class="is-label-content" v-html="label"></span><n-info :icon="infoIcon" v-if="info"><span v-html="info"></span></n-info></label>
		</div>
		<div class="is-content-before" v-if="before" v-html="before"></div>

		<div class="is-content-wrapper" v-if="edit">
			<div v-for="item in items" class="is-form-radio" :class="{ 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }">
				<input ref="input" 
					type="radio" 
					:name="name"
					:disabled="!edit || disabled"
					:value="extracter ? extracter(item) : item"
					v-checked="(!mustChoose || chosen) && value == (extracter ? extracter(item) : item)"
					@input="select(item)"
					v-if="!hide" 
					class="n-form-radio-input"
				/><slot name="label" :value="item" :select="function() { select(item) }"><label class="is-label" @click="select(item); $event.stopPropagation()" v-html="formatter ? formatter(item) : item"></label></slot>
			</div>
		</div>
		<div class="is-read-only" v-else>
			<slot><span class="is-readable">{{ type == 'password' ? '*******' : localValue }}</span></slot>
		</div>
		<n-messages :messages="messages" v-if="messages && messages.length"/>
		<div class="is-content-after" v-if="after" v-html="after"></div>
	</div>
</template>
