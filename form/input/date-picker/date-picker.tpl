<template id="n-form-date-picker">
	<div class="n-form-date-picker n-form-component">
		<label class="n-form-label" :class="{ 'n-form-input-required': mandatory }" v-if="label">{{ label }}</label>
		<div class="n-form-description" v-if="description && edit">{{description}}</div>
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
	</div>
</template>

