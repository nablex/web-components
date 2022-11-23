<template id="n-form-qr">
	<div class="is-form-qr n-form-component" :class="{'is-qr-scanned': scanned, 'is-scanned': scanned}">
		<div class="is-label-wrapper" v-if="label || info">
			<label class="is-label" v-if="label"><span class="is-label-content" v-html="label"></span><n-info :icon="infoIcon" v-if="info"><span v-html="info"></span></n-info></label>
		</div>
		<div class="is-content-before" v-if="before" v-html="before"></div>
		<div class="n-form-qr-container" v-show="!switchQrCode || !code">
			<div class="n-form-canvas-container">
				<canvas ref="canvas" ></canvas>
				<div ref="overlay" class="overlay" v-show="!scanning" ><button class="is-button n-form-qr-retry" :class="buttonClass" @click="rescan"><span class="icon" :class="icon" v-if="icon"></span><span class="label">{{ buttonLabel ? buttonLabel : "%{Scan Code}" }}</span></button></div>
			</div>
		</div>
		<div v-if="switchQrCode && code" class="n-form-qr-code" :style="{'width':canvasWidth + 'px', 'height': canvasHeight + 'px'}">
			<img :src="$services.swagger.parameters('nabu.libs.misc.qr.web.render', { type: 'svg', content: code, name: 'qr.svg' }).url"/>
			<div v-show="!scanning" class="actions"><button class="is-button n-form-qr-retry" :class="buttonClass" @click="rescan"><span class="icon" :class="icon" v-if="icon"></span><span class="label">{{ buttonLabel ? buttonLabel : "%{Scan Code}" }}</span></button></div>
		</div>
		<n-form-text v-if="manualEntry" ref='text' v-model="code" :label="manualLabel" @input='checkEmpty' :required='required' :schema='schema'
			:placeholder='placeholder'
			:validator='validator'
			:edit='edit'
			:timeout="600"/>
		<n-form-text v-if="zoomable && scanning" type="range" v-model="zoomLevel" label="Zoom" :min="zoomMin" :max="zoomMax" :step="zoomStep"/>
		<n-messages :messages="messages" v-if="messages && messages.length"/>
		<div class="is-content-after" v-if="after" v-html="after"></div>
	</div>
</template>