<template id="n-form-date">
	<div class="is-form-date" v-auto-close="function() { show = false }">
		<n-form-text class="n-form-date-input" 
			@focus="focus" 
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
			ref="text"
			:timeout="timeout">
			
			<icon class="is-suffix" slot="suffix" :name="show ? 'times' : 'calendar-alt'" :class="{'is-open': shown, 'is-closed': !shown }" @click.native="function() { edit && !disabled ? show = !show : show = false }" v-show="edit"/>
		</n-form-text>
		
		<n-input-date 
			:formatter="formatter" 
			:parser="parser"
			:minimum="minimum"
			:maximum="maximum"
			:allow="allow"
			v-show="show" 
			v-model="date"
			:years-dropdown="yearsDropdown"
			:years-from="yearsFrom"
			:years-to="yearsTo"
			:includeHours="includeHours"
			:includeMinutes="includeMinutes"
			:includeSeconds="includeSeconds"
			:default="defaultValue"
			ref="dateInput"/>
		
		<n-messages :messages="messages" v-if="messages && messages.length"/>
	</div>
</template>
