<template id="n-button">
	<button :class="{'has-text': text, 'has-icon': icon, 'primary': !type }" :class="type">
		<span v-if="icon" :class="'n-icon-' + icon" class="n-icon"></span>
		<span v-if="text">{{ text }}</span>
	</button>
</template>