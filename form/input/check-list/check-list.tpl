<template id="n-form-checkbox-list">
	<div class="is-form-checkbox-list" :class="[{ 'is-required': mandatory, 'is-optional': !mandatory, 'is-hidden': hide, 'is-invalid': valid != null && !valid, 'is-valid': valid != null && valid, 'has-prefix': !!prefix || !!prefixIcon, 'has-suffix': !!suffix || !!suffixIcon, 'has-before': !!before, 'has-after': !!after, 'has-label': !!label, 'has-info': !!info }, type ? 'is-form-text-' + type : null ]">
		<div class="is-label-wrapper" v-if="label || info">
			<label class="is-label" v-if="label"><span class="is-label-content" v-html="label"></span><n-info :icon="infoIcon" v-if="info"><span v-html="info"></span></n-info></label>
		</div>
		<div class="is-content-before" v-if="before" v-html="before"></div>
		<div class="is-content-wrapper" v-if="edit">
			<n-form-checkbox v-for="item in items"
				:mandatory="false"
				:value="isChecked(item)"
				@input="toggle(item)"
				:label="formatter ? formatter(item) : item"
				/>
		</div>
		<n-messages :messages="messages" v-if="messages && messages.length"/>
		<div class="is-content-after" v-if="after" v-html="after"></div>
	</div>
</template>

<template id="n-form-checkbox-list-configure">
	<div/>
</template>