<template id="n-input-combo">
	<div class="n-component n-input-combo" :class="{ 'n-input-combo-no-labels': !labels, 'is-show-values': showValues }">
		<div class="n-input-combo-label-container" v-auto-close="function() { showLabels = false }" v-if="labels">
			<div class="n-component-label n-input-combo-label" v-if="label" @click="showLabels = !showLabels">
				<slot name="label" :label="label"><span>{{ typeof(label) == "string" ? label : label.title }}</span><icon name="chevron-down"/></slot>
			</div>
			
			<ul class="n-input-combo-dropdown n-input-combo-dropdown-labels" v-if="labels.length > 1 && showLabels">
				<li v-for="single in labels" class="n-input-combo-dropdown-label" :class="{ 'is-active': single == label }" @click="selectLabel(single)" auto-close>
					<slot name="label-dropdown" :label="single"><span>{{ typeof(single) == "string" ? single : single.title }}</span></slot>
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
				@keyup="$emit('keyup', $event)"
				@keydown="$emit('keydown', $event)"
				@keypress="validateKey"
				:name="name"
				:value="content"
				:readonly="!allowTyping"
				:disabled="disabled"
			/><slot name="input-after" :toggle="function() { showValues = !showValues }"><icon name="chevron-down" @click="showValues = !showValues"/></slot
			
			><ul class="n-input-combo-dropdown n-input-combo-dropdown-values" v-if="showValues && values && values.length">
				<li v-if="resetValue && value != null" class="n-input-combo-dropdown-value n-input-combo-dropdown-reset-value" :auto-close="autoclose" @click="updateValue(null)">
					<span v-content="resetValue"></span>
				</li>
				<li v-for="potential in values" class="n-input-combo-dropdown-value" :class="{ 'is-active': extracter ? extracter(potential) == value : potential == value, 'is-pondering': potential == keyValue }" @click="updateValue(potential)" :auto-close="autoclose">
					<slot name="value" :value="potential"><span v-html="prettyFormatter ? prettyFormatter(potential) : (formatter ? formatter(potential) : potential)"></span></slot>
				</li>
			</ul
			><ul class="n-input-combo-dropdown n-input-combo-dropdown-values" v-else-if="showValues && filtering && calculatingValue">
				<li class="n-input-combo-dropdown-value n-input-combo-dropdown-calculating-value" :auto-close="autoclose">
					<span v-content="calculatingValue"></span>
				</li>
			</ul
			><ul class="n-input-combo-dropdown n-input-combo-dropdown-values" v-else-if="showValues && emptyValue && !filtering">
				<li class="n-input-combo-dropdown-value n-input-combo-dropdown-empty-value" :auto-close="autoclose">
					<span v-content="emptyValue"></span>
				</li>
			</ul>
		</div>
		<slot name="bottom"></slot>
	</div>
</template>

