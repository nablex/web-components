<template id="n-form-file">
	<div class="is-form-file" :class="[{ 'is-required': mandatory, 'is-optional': !mandatory, 'is-hidden': hide, 'is-invalid': valid != null && !valid, 'is-valid': valid != null && valid, 'has-prefix': !!prefix || !!prefixIcon, 'has-suffix': !!suffix || !!suffixIcon, 'has-before': !!before, 'has-after': !!after, 'has-label': !!label, 'has-info': !!info } ]">
		<div class="is-label-wrapper" v-if="label || info">
			<label class="is-label" v-if="label"><span class="is-label-content" v-html="label"></span><n-info :icon="infoIcon" v-if="info"><span v-html="info"></span></n-info></label>
		</div>
		<div class="is-content-before" v-if="before" v-html="before"></div>
		<div class="is-content-wrapper" v-if="edit">
			<n-input-file :types='types' ref='form' :amount='1'
				:edit='edit'
				:schema='schema'
				v-bubble:change
				v-bubble:input
				:label='label'
				:value='value'
				:name='name'
				:dropLabel='dropLabel'
				:browseLabel='browseLabel'
				:browseIcon='browseIcon'
				:visualiseSelectedFiles='true'
				:deleteIcon='deleteIcon'
				:timeout='timeout'
				:max-file-size='maxFileSize ? parseInt(maxFileSize) : null'
				:disabled='disabled'/>
		</div>
		<div class="is-read-only" v-else>
			<slot><span class="is-readable">%{Selected {{ files.length  }} files}</span></slot>
		</div>
		<n-messages :messages="messages" v-if="messages && messages.length"/>
		<div class="is-content-after" v-if="after" v-html="after"></div>
	</div>
</template>

