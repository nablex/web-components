<template id="n-input-date">
	<div class="n-input-date">
		<table :class="yearsDropdown ? 'table dropdown' : 'table'" cellspacing="0" cellpadding="0">
			<thead class="caption">
				<tr class="year">
					<th colspan="7">
						<div class="is-row is-align-space-between">
							<div class="buttons-previous">
								<button v-if="!yearsDropdown" class="is-button is-size-small is-variant-ghost" @click="canIncrementMonth(-12) ? date = incrementMonth(-12) : null" :disabled="!canIncrementMonth(-12)"><icon name="chevron-circle-left"/></button>
								<button class="is-button is-size-small is-variant-ghost" @click="canIncrementMonth(-1) ? date = incrementMonth(-1) : null" :disabled="!canIncrementMonth(-1)"><icon name="chevron-left"/></button>
							</div>
							<span class="month">{{ months[date.getMonth()] }} {{ !yearsDropdown ? date.getFullYear() : '' }}</span>
							<div class="buttons-next">
								<button class="is-button is-size-small is-variant-ghost" @click="canIncrementMonth(1) ? date = incrementMonth(1) : null" :disabled="!canIncrementMonth(1)"><icon name="chevron-right"/></button>
								<button v-if="!yearsDropdown" class="is-button is-size-small is-variant-ghost" @click="canIncrementMonth(12) ? date = incrementMonth(12) : null" :disabled="!canIncrementMonth(12)"><icon name="chevron-circle-right"/></button>
							</div>
						</div>
					</th>
				</tr>
				<tr v-if="yearsDropdown" class="year-selection">
					<th colspan="7">
						<n-form-combo 
							:allow-typing="false"
							:value="year" 
							@input="selectYear"
							:items="years"/>
					</th>
				</tr>
				<tr class="days">
					<th>%{date:Mo}</th>
					<th>%{date:Tu}</th>
					<th>%{date:We}</th>
					<th>%{date:Th}</th>
					<th>%{date:Fr}</th>
					<th>%{date:Sa}</th>
					<th>%{date:Su}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="week in weeks">
					<td v-for="day in week" :class="{'is-today': day.value != null && isToday(day.value), 'is-active': day.value != null && isSelected(day.value), 'is-available': day.value != null && isAvailable(day.value), 'is-unavailable': day.value != null && !isAvailable(day.value)}">
						<button auto-close-date-picker v-if="day.label" class="is-button is-size-small is-variant-ghost" @click="select(day.value)" :disabled="day.value != null && !isAvailable(day.value)"><span class="is-text">{{ day.label }}</span></button>
					</td>
				</tr>
			</tbody>
		</table>
		<div v-if="includeHours || includeMinutes || includeSeconds" class="time">
			<n-form-text type="number"
				v-model="hours"
				v-if="includeHours"
				@input="select(date)"/>
			<n-form-text type="number"
				v-model="minutes"
				v-if="includeMinutes"
				@input="select(date)"/>
			<n-form-text type="number"
				v-model="seconds"
				v-if="includeSeconds"
				@input="select(date)"/>
		</div>
		<div class="n-input-date-legend" v-if="allow">
			<span class="n-input-date-available">%{date:Available Dates}</span>
			<span class="n-input-date-selected">%{date:Selected Date}</span>
		</div>
	</div>
</template>
