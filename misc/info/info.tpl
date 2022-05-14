<template id="n-info">
	<div class="is-info" v-auto-close="function() { showing = false }" @mouseover="showing = autoClose" @mouseout="showing = !autoClose" @click="showing = autoClose ? showing : !showing">
		<icon :name="icon"/>
		<div class="is-content-wrapper" v-show="showing"><slot></slot></div>
	</div>
</template>
