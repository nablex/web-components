<template id="n-form">
	<form v-on:submit.prevent class="is-form" :mode="mode">
		<slot name="header"></slot>
		<section class="is-form-section" :class="contentClass">
			<slot></slot>
		</section>
		<slot name="footer"></slot>
	</form>
</template>