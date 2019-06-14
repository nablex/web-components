<template id="n-form-barcode">
	<div class="n-form-barcode n-form-component" :class="{'n-form-barcode-scanned': scanned, 'n-form-barcode-scanning': scanning}">
		<label v-if="label">{{label}}</label>
		<div class="n-form-barcode-container">
			<div class="n-form-canvas-container">
				<video v-show="scanning" ref="video"></video>
				<canvas class="barcode-canvas" ref="canvas" :width="width" :height="height" v-show="scanning"></canvas>
				<div ref="overlay" class="overlay" v-show="!scanning">
					<button class="n-form-barcode-retry" @click="scan">
						<span class="icon" :class="icon" v-if="icon"></span>
						<span class="label">{{ buttonLabel ? buttonLabel : "%{Scan Code}" }}</span>
					</button>
				</div>
			</div>
		</div>
		<n-form-text class="manual-entry" v-if="manualEntry" ref="text" v-model="code" @input="checkEmpty" :required="required" :schema="schema"
			:label="manualLabel"
			:placeholder="manualPlaceholder"
			:validator="validator"
			:edit="edit"/>
	</div>
</template>
