<template id="n-paging">
	<ul class="is-menu" v-show="total > 0 || showEmpty">
		<li class="is-column" v-if="arrows"><button :class="buttonClasses" class="is-button" @click="update(0)" :disabled="!page || loading"><span class="n-icon n-icon-angle-double-left"></span></button></li>
		<li class="is-column" v-if="arrows"><button :class="buttonClasses" class="is-button" @click="update(page - 1)" :disabled="!page || loading"><span class="n-icon n-icon-angle-left"></span></button></li>
		<li class="is-column" v-for="button in buttons"><button :class="[buttonClasses, {'is-active': button - 1 == page}]" class="is-button has-text" :disabled="loading" @click="button == null ? promptPage() : update(button - 1)">{{ button == null ? "..." : button }}</button></li>
		<li class="is-column" v-if="arrows"><button :class="buttonClasses" class="is-button" @click="update(page + 1)" :disabled="page >= total - 1 || loading"><span class="n-icon n-icon-angle-right"></span></button></li>
		<li class="is-column" v-if="arrows"><button :class="buttonClasses" class="is-button" @click="update(total - 1)" :disabled="page >= total - 1 || loading"><span class="n-icon n-icon-angle-double-right"></span></button></li>
	</ul>
</template>

<template id="n-paging-prompt">
	<n-form :class="formClasses" ref="form">
		<n-form-section>
			<n-form-text v-focus v-model="page" type="number" pattern="^[0-9]+" label="%{Go To Page}"/>
		</n-form-section>
		<footer class="is-row is-align-space-between">
			<button @click="$reject" class="is-button is-variant-link" type="button">Cancel</button>
			<button type="submit" class="is-button is-variant-primary" :disabled="!page" @click="$resolve(page)">%{Go}</button>
		</footer>
	</n-form>
</template>