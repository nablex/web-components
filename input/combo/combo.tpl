<template id="n-input-combo">
	<div class="n-component n-input-combo" :class="{ 'n-input-combo-no-labels': !labels }">
		<div class="n-input-combo-label-container" v-auto-close="function() { showLabels = false }" v-if="labels">
			<div class="n-component-label n-input-combo-label" v-if="label" @click="showLabels = !showLabels">
				<slot name="label" :label="label"><span>{{ typeof(label) == "string" ? label : label.title }}</span><i class="n-icon n-icon-arrow-down"></i></slot>
			</div>
			
			<ul class="n-input-combo-dropdown n-input-combo-dropdown-labels" v-if="labels.length > 1 && showLabels">
				<li v-for="single in labels" class="n-input-combo-dropdown-label" :class="{ 'active': single == label }" @click="selectLabel(single)" auto-close>
					<slot name="label-dropdown" :label="single"><span>{{ typeof(single) == "string" ? single : single.title }}</span></slot>
				</li>
			</ul>
		</div>
		<div class="n-input-combo-input-container" v-auto-close="function() { showValues = false }">
		
			<input @focus="showValues = true" autocomplete="off" @input="updateContent($event.target.value)" class="n-input-combo-input field" type="text" :placeholder="this.label && this.label.placeholder ? this.label.placeholder : placeholder" v-model="content">
		
			<slot name="input-after" :toggle="function() { showValues = !showValues }"></slot>
			
			<ul class="n-input-combo-dropdown n-input-combo-dropdown-values" v-if="showValues && values && values.length">
				<li v-for="potential in values" class="n-input-combo-dropdown-value" :class="{ 'active': potential == value }" @click="updateValue(potential)" :auto-close="autoclose">
					<slot name="value" :value="potential"><span>{{ formatter ? formatter(potential) : potential }}</span></slot>
				</li>
			</ul>
		</div>
		<slot name="bottom"></slot>
	</div>
</template>