<template id="n-sidebar">
	<section class="n-sidebar" v-auto-close.sidebar="function() { $emit('close') }">
		<header>
			<slot name="header"></slot>
			<span class="n-icon n-icon-times fa fa-times close" @click="$emit('close')"></span>
		</header>
		<main><slot></slot></main>
		<footer></footer>
	</section>
</template>