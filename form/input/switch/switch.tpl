<template id="n-form-switch">
	<n-form-checkbox :value="internal" :label="label" class="n-form-switch" :edit="edit" :item="item" @input="updateValue" :invert="invert" :after="after" :before="before" :info="info" :info-icon="infoIcon">
		<template slot="overlay" scope="scope">
			<label @click="scope.toggle()" class="n-form-switch-label">
				<span class="n-form-switch-button"></span>
			</label>
		</template>
	</n-form-checkbox>
</template>
