<template id="n-sidebar">
	<section class="n-sidebar is-sidebar" v-auto-close.sidebar="autoClose" :class="position">
		<header>
			<slot name="header"></slot>
			<span class="n-icon n-icon-times fa fa-times close" @click="close"></span>
		</header>
		<main><slot></slot></main>
		<footer></footer>
	</section>
</template>
