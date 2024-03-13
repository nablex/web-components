<template id="n-input-combo2">
	<div class="n-input-combo2" v-auto-close.combo2="function() { showValues = false }" tabindex="-1" @keydown.tab="showValues=false">
		<div class="n-input-combo2-input-container" @click="showValues = true" :class="{'has-suffix': showAmount && rawValues.length}">
			<div class="n-input-combo-tag-container" v-if="showTags && multiple && rawValues.length">
				<div v-if="hiddenAmount" class="is-tag" :class="getChildComponentClasses('combo-tag')">
					<span class="is-text">
						<span class="is-text-value" v-content.sanitize="hiddenAmount"></span>
					</span>
				</div>
				<div v-for="single in visibleRawValues" class="is-tag" :class="getChildComponentClasses('combo-tag')">
					<img :src="deleteTagIcon.indexOf('http') == 0 ? deleteTagIcon : '${server.root()}resources/' + deleteTagIcon" v-if="deleteTagIcon && deleteTagIcon.match(/^.*\.[^.]+$/)" class="is-icon" @click="deselect(single)"/>
					<icon :name="deleteTagIcon" v-else-if="deleteTagIcon" @click.native="deselect(single)"/>
					<span class="is-text">
						<span class="is-text-value" v-content.sanitize="getFormatted(single)"></span>
					</span>
				</div>
			</div>
			<input
				:readonly="!allowTyping"
				:disabled="disabled"
				ref="searchInput"
				v-model="search" 
				@keypress.enter="commitKeyValue"
				@keyup.esc="showValues = false"
				@keydown.up="moveUp"
				@keydown.down="moveDown"
				@keydown.tab="showValues = false"
				:placeholder="currentPlaceholder"
				@focus="showValues = true"
				:after="showAmount ? rawValues.length : null" />
			<span class="is-suffix" v-if="showAmount && rawValues.length">{{rawValues.length}}</span>
		</div><ul class="n-input-combo-dropdown n-input-combo-dropdown-values" v-if="showValues && potentialValues.length" ref="valueList">
			<li v-if="multiple && selectAllValue" class="n-input-combo-dropdown-value n-input-combo-dropdown-select-all-value" :class="{'selected-all': rawValues.length == potentialValues.length, 'selected-partial': rawValues.length < potentialValues.length}" @click="toggleAll">
				<n-form-checkbox tabindex="-1" v-if="useCheckbox" :value="rawValues.length == potentialValues.length" @input="toggleAll"/>
				<span v-content="potentialValues.length == rawValues.length && resetValue ? resetValue : selectAllValue"></span>
			</li>
			<li v-if="!(multiple && selectAllValue) && resetValue && rawValues.length" class="n-input-combo-dropdown-value n-input-combo-dropdown-reset-value" :auto-close-combo2="autoclose" @click="deselect()">
				<n-form-checkbox tabindex="-1" v-if="useCheckbox" :value="rawValues.length == potentialValues.length" @input="deselect()"/>
				<span v-content="resetValue"></span>
			</li>
			<li v-for="potential in potentialValues" class="n-input-combo-dropdown-value" :class="{ 'is-active': rawValues.indexOf(potential) >= 0, 'is-pondering': potential == keyValue }" @click="toggle(potential)" :auto-close-combo2="!multiple">
				<n-form-checkbox tabindex="-1" v-if="useCheckbox" :value="rawValues.indexOf(potential) >= 0" @input="toggle(potential)"/>
				<slot name="value" :value="potential"><span v-html="getPrettyFormatted(potential)"></span></slot>
			</li>
		</ul
		><ul class="n-input-combo-dropdown n-input-combo-dropdown-values" v-else-if="showValues && calculating && calculatingValue">
			<li class="n-input-combo-dropdown-value n-input-combo-dropdown-calculating-value" :auto-close-combo2="autoclose">
				<span v-content="calculatingValue"></span>
			</li>
		</ul
		><ul class="n-input-combo-dropdown n-input-combo-dropdown-values" v-else-if="showValues && emptyValue">
			<li class="n-input-combo-dropdown-value n-input-combo-dropdown-empty-value" :auto-close-combo2="autoclose">
				<span v-content="emptyValue"></span>
			</li>
		</ul>
	</div>
</template>
