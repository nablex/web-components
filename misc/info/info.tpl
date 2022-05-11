<template id="n-info">
	<div class="n-info is-info" v-auto-close="function() { showing = false }" @mouseover="showing = autoClose" @mouseout="showing = !autoClose" @click="showing = autoClose ? showing : !showing">
		<icon :name="icon"/>
		<div class="n-info-content is-info-content" v-show="showing"><slot></slot></div>
	</div>
</template>
