<template id="n-input-file">
	<div class="n-input-file" @paste="pasteFiles($event)" @drop="selectFiles($event)" @mouseout="dragging = false" :class="{ 'drag-drop': hasDropSupport(), 'drag-over': dragging }" @dragenter="dragging = true" @dragover="$event.preventDefault()" @dragleave="dragging = false">
		<slot :browse="browse">
			<div>%{file:<strong>Drag a file</strong><span> or </span><a :disabled="disabled" href="javascript:void(0)" @click="browse()">browse</a> ({{value.length}})}</div>
		</slot> 
		<input ref="input" type="file" @change="selectFiles($event)" :accept="types ? types : ['*']" :multiple="!amount || amount > 1" />
		<slot name="after"></slot>
	</div>
</template>
