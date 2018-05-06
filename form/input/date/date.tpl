<template id="n-form-date">
	<div class="n-form-date" v-auto-close="function() { show = false }">
		<slot name="top"></slot>
		
		<n-form-text class="n-form-date-input" 
			@focus="show = edit && !disabled" 
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
			type="text"
			:hide="hide"
			:disabled="disabled"
			:validator="dateValidate"
			:unique="unique"
			ref="text">
			
			<span slot="after-input" class="n-icon fa n-form-date-icon" 
				:class="{ 'n-icon-calendar': !show, 'fa-calendar-alt': !show, 'n-icon-times': show, 'fa-times': show, 'n-form-date-icon-show': show }" @click="edit && !disabled ? show = !show : show = false" v-show="edit"></span>
		</n-form-text>
		
		<n-input-date 
			:formatter="formatter" 
			:parser="parser"
			:minimum="minimum"
			:maximum="maximum"
			:allow="allow"
			v-show="show" 
			v-model="date"
			ref="dateInput"/>
		
		<slot name="bottom">
			<n-messages :messages="messages" v-if="messages && messages.length"/>
		</slot>
	</div>
</template>