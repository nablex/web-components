<template id="n-form-date">
	<div class="n-form-date" v-auto-close="function() { show = false }">
		<slot name="top"></slot>
		<slot name="label">
			<span class="n-form-label" v-if="label">{{ label }}</span>
		</slot>
		
		<n-form-text class="n-form-date-input" 
			@focus="show = edit" 
			:pattern="pattern ? pattern : '^[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$'" 
			v-model="date" 
			:placeholder="placeholder"
			:label="label"
			:edit="edit"
			:required="required"
			:name="name"
			:schema="schema"
			:minLength="minLength"
			:maxLength="maxLength"
			type="date"
			:hide="hide"
			:disabled="disabled"
			:validator="dateValidate"
			:unique="unique"
			ref="text"
			/>
			
		<span class="n-form-date-icon n-icon-calendar" @click="show = edit" v-show="edit"></span>
		
		<n-input-date 
			:formatter="formatter" 
			:parser="parser"
			:minimum="minimum"
			:maximum="maximum"
			:allow="allow"
			v-show="show" 
			v-model="date"
			ref="dateInput"/>
		
		<slot v-if="!edit">
			<span class="n-form-read">{{ value }}</span>
		</slot>
		<slot name="bottom">
			<n-messages :messages="messages" v-if="messages && messages.length"/>
		</slot>
	</div>
</template>