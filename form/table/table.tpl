<template id="n-form-table">
	<form v-on:submit.prevent class="n-form n-form-table" :schema="schema">
		<slot name="header"></slot>
		<header name="header" class="n-form-table-header" v-show="hasContent">
			<span class="n-form-label" v-for="label in labels" :class="{ 'n-form-hidden': label && label.component.hide }" :optional="label == null || label.component.hide != null">{{ label ? label.name : null }}</span>
		</header>
		<section class="n-form-table-content">
			<slot></slot>
		</section>
		<section class="n-form-table-no-content" v-if="!hasContent">
			<slot name="no-content"><span>No Content</span></slot>
		</section>
		<slot name="footer"></slot>
	</form>
</template>