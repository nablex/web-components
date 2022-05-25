<template id="n-collapsible">
	<div class="is-collapsible" :class="{ 'is-open': show }">
		<h3 class="is-title" @click="toggle()"><icon :name="show ? 'chevron-down' : 'chevron-right'"/><slot name="text"><span class="is-text"><span v-if="before" class="is-text-before" v-html="before"></span><span class="is-text-main" v-if="title" v-html="title"></span><span v-if="after" class="is-text-after" v-html="after"></span></span></slot><div class="is-title-buttons" @mouseover="toggleable=false" @mouseout="toggleable=true"><slot name="buttons"></slot></div></h3>
		<div class="n-icon-spinner spinner" v-if="loading"></div>
		<div class="is-collapsible-content" :class="contentClass" v-if="show">
			<slot></slot>
		</div>
	</div>
</template>
