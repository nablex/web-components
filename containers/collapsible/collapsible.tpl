<template id="n-collapsible">
	<div class="n-collapsible" :class="{ 'n-collapsible-show': show }">
		<h3 class="n-collapsible-title" @click="toggle()"><span :class="{ 'n-icon-chevron-right': !show, 'n-icon-chevron-down': show, 'fa-chevron-right': !show, 'fa-chevron-down': show}" class="n-icon fa"></span><span class="n-collapsible-title-content">{{ title }}</span></h3>
		<div class="n-icon-spinner spinner" v-if="loading"></div>
		<div class="n-collapsible-content" v-if="show">
			<slot></slot>
		</div>
	</div>
</template>