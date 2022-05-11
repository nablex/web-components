<template id="n-form">
	<form v-on:submit.prevent class="is-form">
		<slot name="header"></slot>
		<section class="is-form-content">
			<slot></slot>
		</section>
		<slot name="footer"></slot>
	</form>
</template>