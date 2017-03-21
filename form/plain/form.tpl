<template id="n-form">
	<form v-on:submit.prevent class="n-form">
		<slot name="header"></slot>
		<section>
			<slot></slot>
		</section>
		<slot name="footer"></slot>
	</form>
</template>