<template id="n-form-text">
	<div class="n-form-component n-form-text" :class="[mandatory ? 'n-form-input-required' : 'n-form-input-optional', { 'n-form-hidden': hide },{ 'n-form-invalid': valid != null && !valid },{ 'n-form-valid': valid != null && valid }, type ? 'n-form-text-' + type : null ]" :optional="hide != null">
		<slot name="top"></slot>
		<div class="n-form-label-wrapper" v-if="label || info || (description && descriptionType == 'info')">
			<slot name="label" :label="label" :mandatory="mandatory">
				<label class="n-form-label" :class="{ 'n-form-input-required': mandatory }" v-if="label">{{ label }}</label>
			</slot>
			<n-info class="n-form-component-description n-form-component-description-info" :icon="descriptionIcon" v-if="descriptionType == 'info' || info"><span  v-html="info ? info : description"></span></n-info>
		</div>
		<div class="n-form-component-description n-form-component-description-before"  v-if="descriptionType == 'before' && (descriptionIcon || description)">
			<span class="n-form-component-description-icon" :class="descriptionIcon" v-if="descriptionIcon"></span>
			<span class="n-form-component-description-label">{{ description }}</span>
		</div>
		<div class="n-form-input-wrapper">
			<input 
				@keyup="handleKeyup"
				@input="updateValue($event.target.value)" 
				:placeholder="placeholder" 
				:type="type" 
				:disabled="disabled" 
				v-model="localValue"
				class="field"
				:min="minimum"
				:max="maximum"
				v-if="edit && type != 'area'" 
				:class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }"
				:maxlength="maxLength"
				@focus="focus"
				ref="input"
				:name="name"
				/><textarea
					@input="updateValue($event.target.value)" 
					:rows="rows"
					:placeholder="placeholder" 
					:disabled="disabled" 
					:value="value" 
					class="field" 
					v-if="edit && type == 'area'" 
					:class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }"
					@focus="$emit('focus')"
					ref="input"
					:name="name"
				/><div class="n-form-input-after" :class="{'has-suffix-icon': suffixIcon, 'has-suffix': suffix}">
					<slot name="after-input"><span class="n-form-suffix-icon" v-if="suffixIcon" :class="suffixIcon"></span><span class="n-form-suffix" v-else-if="suffix">{{ suffix }}</span><span class="n-form-empty"></span></slot>
					<span class="n-input-result" :class="iconValid" v-if="(!suffix && !suffixIcon) && !valid != null && valid && edit"></span>
					<span class="n-input-result" :class="iconInvalid" v-if="(!suffix && !suffixIcon) && valid != null && !valid && edit"></span>
				</div>
		</div>
		
		<span class="n-form-input-required" v-if="mandatory"></span>
		<span class="n-form-input-optional" v-if="!mandatory"></span>
		<slot v-if="!edit">
			<span class="n-form-read">{{ type == 'password' ? '*******' : value }}</span>
		</slot>
		<slot name="bottom">
			<n-messages :messages="messages" v-if="messages && messages.length"/>
		</slot>
		
		
		<div class="n-form-component-description n-form-component-description-after" v-if="descriptionType == 'after' && (descriptionIcon || description)">
			<span class="n-form-component-description-icon" :class="descriptionIcon" v-if="descriptionIcon"></span>
			<span class="n-form-component-description-label">{{ description }}</span>
		</div>
	</div>
</template>

