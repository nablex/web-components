<template id="n-form-barcode">
	<div class="n-form-barcode n-form-component" :class="{'n-form-barcode-scanned': scanned, 'n-form-barcode-scanning': scanning}">
		<label v-if="label">{{label}}</label>
		<div class="n-form-barcode-container">
			<div class="n-form-canvas-container">
				<canvas v-show="scanning" ref="canvas" :width="width" :height="height" id="debug"></canvas>
				<div ref="overlay" class="overlay" v-show="!scanning"><button class="n-form-barcode-retry" @click="scan"><span class="icon" :class="icon" v-if="icon"></span><span class="label">{{ buttonLabel ? buttonLabel : "%{Scan Code}" }}</span></button></div>
			</div>
		</div>
		<n-form-text class="manual-entry" v-if="manualEntry" ref='text' v-model="code" :label="manualLabel" @input='checkEmpty' :required='required' :schema='schema'
			:placeholder='placeholder'
			:validator='validator'
			:edit='edit'/>
	</div>
</template>