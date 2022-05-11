<template id="n-form-text">
	<div class="is-form-text is-form-component" :class="[{ 'is-required': mandatory, 'is-optional': !mandatory, 'is-hidden': hide, 'is-invalid': valid != null && !valid, 'is-valid': valid != null && valid }, type ? 'n-form-text-' + type : null ]">
		<slot name="top"></slot>
		<div class="is-form-label-wrapper" v-if="label || info">
			<slot name="label" :label="label" :mandatory="mandatory">
				<label class="is-form-label" v-if="label" v-html="label"></label>
			</slot>
			<n-info class="is-info" :icon="infoIcon" v-if="info"><span v-html="info"></span></n-info>
		</div>
		<slot name="before" :content="before">
			<div class="is-form-content-before" v-if="before" v-html="before"></div>
		</slot>
		<div class="is-form-input-wrapper" v-if="edit">
			<slot name="prefix"><div class="is-prefix" v-if="prefix" v-html="prefix"></div></slot>
			<div class="is-form-action-increment" v-if="type == 'number' && showCustomSpinner" @click="increment">
				<icon name="chevron-up"/>
			</div>
			<input 
				@change="triggerChange"
				@blur="blur($event.target.value)"
				@keyup="$emit('keyup', $event)"
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
					:value="localValue" 
					class="field" 
					:class="{ 'n-form-required': mandatory, 'n-form-optional': !mandatory, 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }"
					ref="input"
					:name="name"
					:autocomplete="autocomplete"
				/><div class="n-form-decrement is-form-action-decrement" v-if="type == 'number' && showCustomSpinner" @click="decrement">
					<icon name="chevron-down"/>
				</div><slot name="suffix"><div class="n-form-suffix is-suffix" v-if="suffix" v-html="suffix"></div></slot><span class="n-input-result"></span><span v-if="type == 'range' && showTooltip" class="n-form-tooltip" ref="tooltip">{{value}}</span>
		</div>
		<div class="n-form-read-only is-form-read-only" v-else>
			<slot><span class="n-form-read">{{ type == 'password' ? '*******' : localValue }}</span></slot>
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

