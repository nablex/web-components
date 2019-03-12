<template id="n-form-qr">
	<div class="n-form-qr n-form-component" :class="{'n-form-qr-scanned': code != null}">
		<label v-if="label">{{label}}</label>
		<div class="n-form-qr-container">
			<div class="n-form-canvas-container">
				<canvas ref="canvas" :width="width" :height="height"></canvas>
				<div ref="overlay" class="overlay" v-show="!scanning" :style="{'width':width + 'px', 'height': height + 'px'}"><button class="n-form-qr-retry" @click="rescan"><span class="label">%{Scan Code}</span></button></div>
			</div>
		</div>
		<n-form-text ref='text' v-model="code" :label="manualLabel" @input='checkEmpty' :required='required' :schema='schema'
			:placeholder='placeholder'
			:validator='validator'
			:edit='edit'/>
	</div>
</template>