<template id="n-form-select">
	<div class="n-form-select">
		<select :name="name" v-model="value" :multiple="multiple" :required="!nillable" :size="size" @mouseover="focused = true" @mouseout="focused = false">
			<option v-for="option in ungrouped" :value="getExtracted(option)" v-html="getPrettyFormatted(option)"></option>
			<optgroup v-for="group in $window.Object.keys(groups)" :label="group">
				<option v-for="option in groups[group]" :value="getExtracted(option)" v-html="getPrettyFormatted(option)"></option>
			</optgroup>
		</select>
	</div>
</template>

