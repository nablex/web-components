<template id="n-menu-dropdown">
	<ul class="n-menu n-menu-dropdown" ref="root" v-auto-close="function() { showing.splice(0, showing.length) }">
		<li v-for="action in actions" :class="{ 'has-children': action.actions }" @mouseover="show(action)" @mouseout="hide(action)">
			<a auto-close class="n-menu-action n-menu-entry" href="javascript:void(0)" @click="handle(action)" v-if="action.handler">{{ action.title }}</a>
			<span class="n-menu-entry" v-if="!action.handler">{{ action.title }}</span>
			<n-menu-dropdown v-if="action.actions" :actions="action.actions" v-show="showing.indexOf(action) >= 0"/>
		</li>
	</ul>
</template>