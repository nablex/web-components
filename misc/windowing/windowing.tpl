<template id="n-windowing">
	<div class="n-windowing">
		<button class="n-windowing-first" @click="update(0)" :disabled="!page || page < 2 || loading"><span class="n-icon n-icon-angle-double-left"></span></button
		><button class="n-windowing-previous" @click="update(page - 1)" :disabled="!page || page < 1 || loading"><span class="n-icon n-icon-angle-left"></span></button
		><span class="n-windowing-number">{{ page }}</span
		><button class="n-windowing-next" @click="update(page + 1)" :disabled="!hasNext || loading"><span class="n-icon n-icon-angle-right"></span></button>
	</div>
</template>
