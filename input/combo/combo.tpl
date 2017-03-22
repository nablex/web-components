<template id="n-combobox">
	<div class="n-component n-combobox">
		<div class="n-combobox-label-container" v-auto-close="function() { showLabels = false }">
			<div class="n-component-label n-combobox-label" v-if="label" @click="showLabels = !showLabels">
				<slot name="label" :label="label"><span>{{ label.title }}</span><i class="n-icon n-icon-arrow-down"></i></slot>
			</div>
			
			<ul class="n-combobox-dropdown n-combobox-dropdown-labels" v-if="labels.length > 1 && showLabels">
				<li v-for="single in labels" class="n-combobox-dropdown-label" :class="{ 'active': single == label }" @click="selectLabel(single)" auto-close>
					<slot name="label-dropdown" :label="single"><span>{{ single.title }}</span></slot>
				</li>
			</ul>
		</div>
		<div class="n-combobox-input-container" v-auto-close="function() { showValues = false }">
		
			<input @focus="showValues = true" @input="updateContent($event.target.value)" class="n-combobox-input field" type="text" :placeholder="this.label ? this.label.placeholder : null" v-model="content">
		
			<ul class="n-combobox-dropdown n-combobox-dropdown-values" v-if="showValues && values && values.length">
				<li v-for="potential in values" class="n-combobox-dropdown-value" :class="{ 'active': potential == value }" @click="updateValue(potential)" auto-close>
					<slot name="value" :value="potential"><span>{{ formatter ? formatter(potential) : potential }}</span></slot>
				</li>
			</ul>
		</div>
	</div>
</template>