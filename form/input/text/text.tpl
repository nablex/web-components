<template id="n-form-text">
	<div class="is-form-text" :class="[{ 'is-required': mandatory, 'is-optional': !mandatory, 'is-hidden': hide, 'is-invalid': valid != null && !valid, 'is-valid': valid != null && valid, 'has-prefix': !!prefix || !!prefixIcon, 'has-suffix': !!suffix || !!suffixIcon, 'has-before': !!before, 'has-after': !!after, 'has-label': !!label, 'has-info': !!info }, type ? 'is-form-text-' + type : null ]">
		<div class="is-label-wrapper" v-if="label || info">
			<label class="is-label" v-if="label"><span class="is-label-content" v-html="label"></span><n-info :icon="infoIcon" v-if="info"><span v-html="info"></span></n-info></label>
		</div>
		<div class="is-content-before" v-if="before" v-html="before"></div>
		<div class="is-content-wrapper" v-if="edit">
			<slot name="prefix"><div class="is-prefix" v-if="prefix || prefixIcon"><icon v-if="prefixIcon" :name="prefixIcon"/><span class="is-text" v-html="prefix" v-if="prefix"></span></div></slot>
			<input 
				@change="triggerChange"
				@blur="blur($event.target.value)"
				@keyup="$emit('keyup', $event)"
				@keydown="$emit('keydown', $event)"
				@input="updateValue($event.target.value)"
				@keypress="checkKey($event)"
				@paste="pasteHandler"
				:placeholder="placeholder" 
				:type="type" 
				:disabled="disabled" 
				v-model="localValue"
				class="is-input"
				:min="minimum"
				:max="maximum"
				:step="step"
				v-if="type != 'area'" 
				:maxlength="maxLength"
				@focus="focus"
				ref="input"
				:name="name"
				:style="'width:'+rangeWidth+';left:'+rangeLeftOffset"
				v-bind="{'contentEditable': type == 'range' ? 'false' : null}"
				:autocomplete="autocomplete"
				/><textarea
					v-else
					@focus="$emit('focus')"
					@blur="$emit('blur')"
					@keyup="$emit('keyup')"
					@input="updateValue($event.target.value)" 
					:rows="rows"
					:placeholder="placeholder" 
					:disabled="disabled" 
					v-model="localValue" 
					class="is-input" 
					ref="input"
					:name="name"
					:autocomplete="autocomplete"
				/><div class="is-number-spinner" v-if="type == 'number' && showCustomSpinner">
					<icon name="chevron-up" @click="increment"/>
					<icon name="chevron-down" @click="decrement"/>
				</div><slot name="suffix"><div class="is-suffix" v-if="suffix || suffixIcon"><icon v-if="suffixIcon" :name="suffixIcon"/><span class="is-text" v-html="suffix"></span></div></slot><span class="is-range-value"></span><span v-if="type == 'range' && showTooltip" class="is-tooltip" ref="tooltip">{{value}}</span>
		</div>
		<div class="is-read-only" v-else>
			<slot><span class="is-readable">{{ type == 'password' ? '*******' : localValue }}</span></slot>
		</div>
		<n-messages :messages="messages" v-if="messages && messages.length"/>
		<div class="is-content-after" v-if="after" v-html="after"></div>
	</div>
</template>

