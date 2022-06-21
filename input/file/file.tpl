<template id="n-input-file">
	<div class="is-input-file" @paste="pasteFiles($event)" @drop="selectFiles($event)" @mouseout="dragging = false" :class="{ 'drag-drop': hasDropSupport(), 'drag-over': dragging }" @dragenter="dragging = true" @dragover="dragOver" @dragleave="dragging = false" :disabled="disabled">
		<button class="is-button is-size-large" :disabled="disabled" @click="browse()" :class="buttonClass"><icon v-if="browseIcon || !browseLabel" :name="browseIcon ? browseIcon : 'plus'"/><span class="is-text" v-if="browseLabel" v-html="browseLabel"></span></a>
		<div class="selected-files" v-if="value.length && visualizeFileNames"><div class="selected-file" v-for="file in value">{{file.name ? file.name : '%{file:unnamed}'}}<span :class="deleteIcon" :disabled="disabled" class="icon" @click="removeFile(file)"></span></div></div>
		<input ref="input" type="file" @change="selectFiles($event)" :accept="types" :multiple="!amount || amount > 1" v-show="false" />
	</div>
</template>
