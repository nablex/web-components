<template id="n-form-date">
	<div class="n-form-date" v-auto-close="function() { show = false }">
		<slot name="top"></slot>
		
		<n-form-text class="n-form-date-input" 
			@focus="showPopup" 
			:pattern="pattern ? pattern : dynamicPattern" 
			:pattern-comment="patternComment"
			v-model="date" 
			:placeholder="placeholder"
			:label="label"
			:edit="edit"
			:required="required"
			:name="name"
			:schema="customizedSchema"
			:minLength="minLength"
			:maxLength="maxLength"
			type="text"
			:hide="hide"
			:disabled="disableTextInput || disabled"
			:validator="dateValidate"
			:unique="unique"
			:info="info"
			:before="before"
			:after="after"
			:description="description"
			:descriptionIcon="descriptionIcon"
			:descriptionType="descriptionType"
			ref="text"
			:timeout="timeout">
			
			<span slot="suffix" class="n-form-suffix n-icon fa n-form-date-icon" 
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
			:includeHours="includeHours"
			:includeMinutes="includeMinutes"
			:includeSeconds="includeSeconds"
			ref="dateInput"/>
		
		<slot name="messages">
			<n-messages :messages="messages" v-if="messages && messages.length"/>
		</slot>
	</div>
</template>
