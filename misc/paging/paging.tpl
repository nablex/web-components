<template id="n-paging">
	<div class="n-paging" v-show="total > 1">
		<button v-if="arrows" class="n-paging-first" @click="update(0)" :disabled="!page || loading"><span class="n-icon n-icon-angle-double-left"></span></button
		><button v-if="arrows" class="n-paging-previous" @click="update(page - 1)" :disabled="!page || loading"><span class="n-icon n-icon-angle-left"></span></button
		><button class="n-paging-page" v-for="button in buttons" :disabled="button - 1 == page || loading" @click="button == null ? promptPage() : update(button - 1)">{{ button == null ? "..." : button }}</button
		><button v-if="arrows" class="n-paging-next" @click="update(page + 1)" :disabled="page >= total - 1 || loading"><span class="n-icon n-icon-angle-right"></span></button
		><button v-if="arrows" class="n-paging-last" @click="update(total - 1)" :disabled="page >= total - 1 || loading"><span class="n-icon n-icon-angle-double-right"></span></button>
	</div>
</template>

<template id="n-paging-prompt">
	<n-form class="layout1">
		<n-form-section>
			<n-form-text v-focus v-model="page" type="number" pattern="^[0-9]+" label="%{Go To Page}"/>
		</n-form-section>
		<footer class="actions global-actions">
			<a href="javascript:void(0)" @click="$reject()">%{Cancel}</a>
			<button class="info" :disabled="!page" @click="$resolve(page)">%{Ok}</button>
		</footer>
	</n-form>
</template>