<template id="n-form-date-picker">
	<div class="n-form-date-picker n-form-component" :class="[mandatory ? 'n-form-input-required' : 'n-form-input-optional', { 'n-form-hidden': hide },{ 'n-form-invalid': valid != null && !valid },{ 'n-form-valid': valid != null && valid }, type ? 'n-form-text-' + type : null ]" :optional="hide != null">
		<slot name="top"></slot>		
		<div class="n-form-label-wrapper">
			<slot name="label" :label="label" :mandatory="mandatory">
				<label class="n-form-label" :class="{ 'n-form-input-required': mandatory }" v-if="label">{{ label }}</label>
			</slot>
			<n-info class="n-form-component-description n-form-component-description-info" :icon="descriptionIcon" v-if="descriptionType == 'info'">{{ description }}</n-info>
		</div>		
		
		
		<div class="n-form-component-description n-form-component-description-before"  v-if="before || (descriptionType == 'before' && (descriptionIcon || description))">
			<span class="n-form-component-description-icon" :class="descriptionIcon" v-if="descriptionIcon"></span>
			<span class="n-form-component-description-label">{{ before ? before : description }}</span>
		</div>
		<n-form-section v-if="edit" class="n-form-date-picker-form">
			<n-form-combo :case-insensitive="true" :ref="field" :disabled="!editable(field)" v-for="field in fields" :filter="listField.bind(self, field)" :value="result[field]"
				:class="'date-picker-' + field"
				:placeholder="getPlaceholder(field)"
				@input="function(newValue) { updateField(field, newValue) }"
				:formatter="formatField.bind(self, field)"/>
		</n-form-section>
		<span v-else class="n-form-read">{{formattedDate}}</span>
		<slot name="bottom">
			<n-messages :messages="messages" v-if="edit && messages && messages.length"/>
		</slot>
		<div class="n-form-component-description n-form-component-description-after" v-if="after || (descriptionType == 'after' && (descriptionIcon || description))">
			<span class="n-form-component-description-icon" :class="descriptionIcon" v-if="descriptionIcon"></span>
			<span class="n-form-component-description-label">{{ after ? after : description }}</span>
		</div>		
	</div>
</template>
