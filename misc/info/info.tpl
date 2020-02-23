<template id="n-info">
	<div class="n-info" v-auto-close="function() { showing = false }" @mouseover="showing = autoClose" @mouseout="showing = !autoClose" @click="showing = autoClose ? showing : !showing">
		<span v-if="$services && $services.page" v-html="$services.page.getIconHtml(icon)"></span>
		<span v-else class="n-icon fa" :class="icon"></span>
		<div class="n-info-content" v-show="showing"><slot></slot></div>
	</div>
</template>
