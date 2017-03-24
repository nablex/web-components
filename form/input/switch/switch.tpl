<template id="n-form-switch">
	<n-form-checkbox v-model="internal" :label="label" class="n-form-switch" @input="$emit('input', internal)">
		<template slot="overlay" scope="scope">
			<label @click="scope.toggle()" class="n-form-switch-label">
				<span class="n-form-switch-button"></span>
			</label>
		</template>
	</n-form-checkbox>
</template>