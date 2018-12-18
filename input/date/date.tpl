<template id="n-input-date">
	<div class="n-input-date">
		<div class="n-input-date-legend" v-if="allow">
			<span class="n-input-date-available">%{date:Available Dates}</span>
			<span class="n-input-date-selected">%{date:Selected Date}</span>
		</div>	
		<table class="table" cellspacing="0" cellpadding="0">
			<caption>
				<a href="javascript:void(0)" class="n-input-date-previous-year n-icon n-icon-chevron-circle-left fa fa-chevron-circle-left" @click="date = incrementMonth(-12)" :disabled="!canIncrementMonth(-12)"></a>
				<a href="javascript:void(0)" class="n-input-date-previous n-icon n-icon-chevron-left fa fa-chevron-left" @click="date = incrementMonth(-1)" :disabled="!canIncrementMonth(-1)"></a>

				<span class="month">{{ months[date.getMonth()] }} {{ date.getFullYear() }}</span>

				<a href="javascript:void(0)" class="n-input-date-next n-icon n-icon-chevron-right fa fa-chevron-right" @click="date = incrementMonth(1)" :disabled="!canIncrementMonth(1)"></a>
				<a href="javascript:void(0)" class="n-input-date-next-year n-icon n-icon-chevron-circle-right fa fa-chevron-circle-right" @click="date = incrementMonth(12)" :disabled="!canIncrementMonth(12)"></a>
			</caption>
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
					<td v-for="day in week" :class="{
						'n-input-date-today': day.value && isToday(day.value), 
						'n-input-date-selected': day.value && isSelected(day.value), 
						'n-input-date-available': allow && day.value && isAvailable(day.value), 
						'n-input-date-not-available': (allow && day.value && !isAvailable(day.value)) || (allow && !day.value)
						}">
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
	</div>
</template>
