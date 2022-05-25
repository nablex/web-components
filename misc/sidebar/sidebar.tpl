<template id="n-sidebar">
	<section class="is-sidebar" v-auto-close.sidebar="autoClose" :class="[position, position == 'right' ? 'is-position-right' : 'is-position-left']">
		<header>
			<slot name="header"></slot>
			<button class="is-button is-variant-close" @click="close"><icon name="times"/></button>
		</header>
		<main><slot></slot></main>
		<footer></footer>
	</section>
</template>

