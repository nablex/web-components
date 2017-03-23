<template id="n-input-file">
	<div class="n-input-file" @paste="pasteFiles($event)" @drop="selectFiles($event)" @mouseout="dragging = false" :class="{ 'drag-drop': hasDropSupport(), 'drag-over': dragging }" @dragenter="dragging = true" @dragover="$event.preventDefault()" @dragleave="dragging = false">
		<slot :browse="browse"></slot> 
		<input ref="input" type="file" @change="selectFiles($event)" :multiple="!amount || amount > 1" />
		<slot name="after"></slot>
	</div>
</template>