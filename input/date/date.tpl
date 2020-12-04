<template id="n-input-date">
	<div class="n-input-date">
		<table :class="yearsDropdown ? 'table dropdown' : 'table'" cellspacing="0" cellpadding="0">
			<thead class="caption">
				<tr>
					<td colspan="7">
						<a v-if="!yearsDropdown" href="javascript:void(0)" class="n-input-date-previous-year n-icon n-icon-chevron-circle-left fa fa-chevron-circle-left" @click="canIncrementMonth(-12) ? date = incrementMonth(-12) : null" :disabled="!canIncrementMonth(-12)"></a>
						<a href="javascript:void(0)" class="n-input-date-previous n-icon n-icon-chevron-left fa fa-chevron-left" @click="canIncrementMonth(-1) ? date = incrementMonth(-1) : null" :disabled="!canIncrementMonth(-1)"></a>
		 
						<span class="month">{{ months[date.getMonth()] }} {{ !yearsDropdown ? date.getFullYear() : '' }}</span>
		
						<a href="javascript:void(0)" class="n-input-date-next n-icon n-icon-chevron-right fa fa-chevron-right" @click="canIncrementMonth(1) ? date = incrementMonth(1) : null" :disabled="!canIncrementMonth(1)"></a>
						<a v-if="!yearsDropdown" href="javascript:void(0)" class="n-input-date-next-year n-icon n-icon-chevron-circle-right fa fa-chevron-circle-right" @click="canIncrementMonth(12) ? date = incrementMonth(12) : null" :disabled="!canIncrementMonth(12)"></a>
					
						<n-input-combo v-if="yearsDropdown"
							:allow-typing="false"
							v-model="year" 
							@input="selectYear(year)"
							:items="years"
						></n-input-combo>
					</td>
				</tr>
			</thead>
			<thead>
				<tr>
					<th>%{date:Mon}</th>
					<th>%{date:Tue}</th>
					<th>%{date:Wed}</th>
					<th>%{date:Thu}</th>
					<th>%{date:Fri}</th>
					<th>%{date:Sat}</th>
					<th>%{date:Sun}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="week in weeks">
					<td v-for="day in week" :class="{'n-input-date-today': day.value != null && isToday(day.value), 'n-input-date-selected': day.value != null && isSelected(day.value), 'n-input-date-available': day.value != null && isAvailable(day.value), 'n-input-date-not-available': day.value != null && !isAvailable(day.value)}">
						<a auto-close v-if="day.label" class="n-input-date-label" href="javascript:void(0)" @click="select(day.value)">{{ day.label }}</a>
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
