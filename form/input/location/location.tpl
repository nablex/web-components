<template id="n-form-location">
	<div class="n-form-location n-form-component">
		<n-form-combo :filter="searchPlace"
			:edit="edit"
			:required="mandatory"
			ref="combo"
			:label="label"
			:value="place"
			:timeout="300"
			@input="update"
			:formatter="formatPlace"/>
	</div>
</template>