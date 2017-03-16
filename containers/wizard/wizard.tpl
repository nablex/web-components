<template id="n-wizard">
	<div class="n-wizard">
		<div class="navigation" ref="navigation">
			<slot name="left" :next="next" :previous="previous"></slot>
			<ol class="steps">
				<li class="step" v-for="(step, index) in steps" :class="{ 'button': browse, active: step == current, inactive: step == current }">
					<slot name="step" step="step">
						<span class="number" v-if="number">{{ index + 1 }}</span>
						<span class="title">{{ step.name }}</span>
					</slot>
				</li>
			</ol>
			<slot name="right" next="next" previous="previous"></slot>
		</div>
		<div class="container" ref="container"></div>
		<slot name="bottom" :next="next" :previous="previous" :hasNext="hasNext" :hasPrevious="hasPrevious"></slot>
	</div>
</template>