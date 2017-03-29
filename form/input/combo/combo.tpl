<template id="n-form-combo">
	<div class="n-form-combo n-form-component">
	
		<slot v-if="!edit">
			<span class="n-form-read">{{ formatter && value ? formatter(value) : value }}</span>
		</slot>

		<n-input-combo v-if="edit" 
			:value="value" 
			:labels="labels" 
			:filter="filter" 
			:formatter="formatter" 
			:class="{ 'n-form-valid': valid != null && valid, 'n-form-invalid': valid != null && !valid }"
			@input="updateValue">
		
			<div class="n-form-combo-bottom" slot="bottom">
				<span class="n-input-result n-icon n-icon-check" v-if="valid != null && valid && edit"></span>
				<span class="n-input-result n-icon n-icon-times" v-if="valid != null && !valid && edit"></span>
				<n-messages :messages="messages" v-if="messages && messages.length"/>
			</div>
			
		</n-input-combo>
	</div>
</template>