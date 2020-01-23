<template id="n-form-text">
	<div class="n-form-component n-form-text" :class="[mandatory ? 'n-form-input-required' : 'n-form-input-optional', { 'n-form-hidden': hide },{ 'n-form-invalid': valid != null && !valid },{ 'n-form-valid': valid != null && valid }, type ? 'n-form-text-' + type : null, {'has-suffix': !!suffix} ]" :optional="hide != null">
		<slot name="top"></slot>
		<div class="n-form-label-wrapper" v-if="label || info">
			<slot name="label" :label="label" :mandatory="mandatory">
				<label class="n-form-label" :class="{ 'n-form-input-required': mandatory }" v-if="label" v-html="label"></label>
			</slot>
			<n-info class="n-form-label-info" v-if="info"><span v-html="info"></span></n-info>
		</div>
		<slot name="before" :content="before">
			<div class="n-form-component-before" v-if="before" v-html="before"></div>
		</slot>
		<div class="n-form-input-wrapper" v-if="edit">
			<input 
				@blur="$emit('blur')"
				@keyup="$emit('keyup')"
				@input="updateValue($event.target.value)"
				@keypress="checkKey($event)"
				@paste="pasteHandler"
				:placeholder="placeholder" 
				:type="type" 
				:disabled="disabled" 
				v-model="localValue"
				class="field"
				:min="minimum"
				:max="maximum"
				:step="step"
				v-if="type != 'area'" 
				:class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }"
				:maxlength="maxLength"
				@focus="focus"
				ref="input"
				:name="name"
				/><textarea
					v-else
					@focus="$emit('focus')"
					@blur="$emit('blur')"
					@keyup="$emit('keyup')"
					@input="updateValue($event.target.value)" 
					:rows="rows"
					:placeholder="placeholder" 
					:disabled="disabled" 
					:value="value" 
					class="field" 
					:class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }"
					ref="input"
					:name="name"
				/><slot name="suffix"><div class="n-form-suffix" v-if="suffix" v-html="suffix"></div></slot><span class="n-input-result"></span>
		</div>
		<div class="n-form-read-only" v-else>
			<slot><span class="n-form-read">{{ type == 'password' ? '*******' : value }}</span></slot>
		</div>
		<slot name="messages" :messages="messages">
			<n-messages :messages="messages" v-if="messages && messages.length"/>
		</slot>
		<slot name="after" :content="after">
			<div class="n-form-component-after" v-if="after" v-html="after"></div>
		</slot>
		<slot name="bottom"></slot>
	</div>
</template>

