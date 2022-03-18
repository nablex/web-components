<template id="n-form-qr">
	<div class="n-form-qr n-form-component" :class="{'n-form-qr-scanned': scanned}">
		<label v-if="label">{{label}}</label>
		<div class="n-form-qr-container" v-show="!switchQrCode || !code">
			<div class="n-form-canvas-container">
				<canvas ref="canvas" :width="width" :height="height"></canvas>
				<div ref="overlay" class="overlay" v-show="!scanning" :style="{'width':width + 'px', 'height': height + 'px'}"><button class="n-form-qr-retry" @click="rescan"><span class="icon" :class="icon" v-if="icon"></span><span class="label">{{ buttonLabel ? buttonLabel : "%{Scan Code}" }}</span></button></div>
			</div>
		</div>
		<div v-if="switchQrCode && code" class="n-form-qr-code" :style="{'width':canvasWidth + 'px', 'height': canvasHeight + 'px'}">
			<img :src="$services.swagger.parameters('nabu.libs.misc.qr.web.render', { type: 'svg', content: code, name: 'qr.svg' }).url"/>
			<div v-show="!scanning" class="actions"><button class="n-form-qr-retry" @click="rescan"><span class="icon" :class="icon" v-if="icon"></span><span class="label">{{ buttonLabel ? buttonLabel : "%{Scan Code}" }}</span></button></div>
		</div>
		<n-form-text v-if="manualEntry" ref='text' v-model="code" :label="manualLabel" @input='checkEmpty' :required='required' :schema='schema'
			:placeholder='placeholder'
			:validator='validator'
			:edit='edit'
			:timeout="600"/>
		<n-form-text v-if="zoomable && scanning" type="range" v-model="zoomLevel" label="Zoom" :min="zoomMin" :max="zoomMax" :step="zoomStep"/>
	</div>
</template>