<template id="n-form">
	<form v-on:submit.prevent class="n-form">
		<slot name="header"></slot>
		<section class="n-form-content">
			<slot></slot>
		</section>
		<slot name="footer"></slot>
	</form>
</template>