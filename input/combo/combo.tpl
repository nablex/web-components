<template id="n-input-combo">
	<div class="n-component n-input-combo" :class="{ 'n-input-combo-no-labels': !labels }">
		<div class="n-input-combo-label-container" v-auto-close="function() { showLabels = false }" v-if="labels">
			<div class="n-component-label n-input-combo-label" v-if="label" @click="showLabels = !showLabels">
				<slot name="label" :label="label"><span v-html="typeof(label) == 'string' ? label : label.title"></span><span class="n-icon n-icon-arrow-down fa fa-chevron-down"></span></slot>
			</div>
			
			<ul class="n-input-combo-dropdown n-input-combo-dropdown-labels" v-if="labels.length > 1 && showLabels">
				<li v-for="single in labels" class="n-input-combo-dropdown-label" :class="{ 'active': single == label }" @click="selectLabel(single)" auto-close>
					<slot name="label-dropdown" :label="single"><span v-html="typeof(single) == 'string' ? single : single.title"></span></slot>
				</li>
			</ul>
		</div>
		<div class="n-input-combo-input-container" v-auto-close="function(inside) { showValues = false; if (!inside) { focusOut() } }">
		
			<input @focus="focusOn" :autocomplete="autocomplete" @input="updateContent($event.target.value)" class="n-input-combo-input field" type="text" :placeholder="label && label.placeholder ? label.placeholder : placeholder" 
				@blur="stillFocused = false"
				@keypress.enter="validateEnter"
				@keydown.tab="validateTab"
				@keyup.esc="doEscape"
				@keydown.up="moveUp"
				@keydown.down="moveDown"
				@keypress="validateKey"
				:name="name"
				:value="cleanUpHtml(content)"
				:readonly="!allowTyping"
				:disabled="disabled">
		
			<slot name="input-after" :toggle="function() { showValues = !showValues }"><span @click="showValues = !showValues" class="n-icon n-icon-arrow-down fa fa-chevron-down"></span></slot>
			
			<ul class="n-input-combo-dropdown n-input-combo-dropdown-values" v-if="showValues && values && values.length">
				<li v-if="resetValue && value != null" class="n-input-combo-dropdown-value n-input-combo-dropdown-reset-value" :auto-close="autoclose" @click="updateValue(null)">
					<span v-content="resetValue"></span>
				</li>
				<li v-for="potential in values" class="n-input-combo-dropdown-value" :class="{ 'active': extracter ? extracter(potential) == value : potential == value, 'pondering': potential == keyValue }" @click="updateValue(potential)" :auto-close="autoclose">
					<slot name="value" :value="potential"><span v-html="formatter ? formatter(potential) : potential"></span></slot>
				</li>
			</ul>
			<ul class="n-input-combo-dropdown n-input-combo-dropdown-values" v-else-if="showValues && filtering && calculatingValue">
				<li class="n-input-combo-dropdown-value n-input-combo-dropdown-calculating-value" :auto-close="autoclose">
					<span v-content="calculatingValue"></span>
				</li>
			</ul>
			<ul class="n-input-combo-dropdown n-input-combo-dropdown-values" v-else-if="showValues && emptyValue && !filtering">
				<li class="n-input-combo-dropdown-value n-input-combo-dropdown-empty-value" :auto-close="autoclose">
					<span v-content="emptyValue"></span>
				</li>
			</ul>
		</div>
		<slot name="bottom"></slot>
	</div>
</template>

