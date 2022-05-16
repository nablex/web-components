<template id="n-collapsible">
	<div class="n-collapsible is-collapsible" :class="{ 'n-collapsible-show': show, 'is-open': show }">
		<h3 class="n-collapsible-title is-title" @click="toggle()"><span :class="{ 'n-icon-chevron-right': !show, 'n-icon-chevron-down': show, 'fa-chevron-right': !show, 'fa-chevron-down': show}" class="n-icon fa is-icon"></span><slot name="text"><span v-if="before" class="n-collapsible-title-before">{{before}}</span><span class="n-collapsible-title-content is-text" v-if="title">{{ title }}</span><span v-if="after" class="n-collapsible-title-after">{{after}}</span></slot><div class="n-collapsible-title-buttons" @mouseover="toggleable=false" @mouseout="toggleable=true"><slot name="buttons"></slot></div></h3>
		<div class="n-icon-spinner spinner" v-if="loading"></div>
		<div class="n-collapsible-content is-collapsible-content" v-if="show">
			<slot></slot>
		</div>
	</div>
</template>
