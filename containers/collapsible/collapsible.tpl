<template id="n-collapsible">
	<div class="n-collapsible">
		<h3 class="n-collapsible-title" @click="show = !show"><span :class="{ 'n-icon-chevron-right': !show, 'n-icon-chevron-down': show}" class="n-icon"></span><span class="n-collapsible-title-content">{{ title }}</span></h3>
		<slot v-if="show"></slot>
	</div>
</template>