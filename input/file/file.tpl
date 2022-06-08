<template id="n-input-file">
	<div class="n-input-file" @paste="pasteFiles($event)" @drop="selectFiles($event)" @mouseout="dragging = false" :class="{ 'drag-drop': hasDropSupport(), 'drag-over': dragging }" @dragenter="dragging = true" @dragover="dragOver" @dragleave="dragging = false" :disabled="disabled">
		<slot :browse="browse">
			<div v-if="browseLabel || dropLabel" class="upload-zone">
				<a class="browse-zone" :disabled="disabled" href="javascript:void(0)" @click="browse()"><span v-if="browseIcon" class="icon" :class="browseIcon"></span>{{browseLabel ? browseLabel : "%{file:browse}"}}</a>
				<span class="drop-zone" v-if="!value.length">{{dropLabel ? dropLabel : "%{file:Drag a file}"}}</span>
				<div class="selected-files" v-if="value.length && visualizeFileNames"><div class="selected-file" v-for="file in value">{{file.name ? file.name : '%{file:unnamed}'}}<span :class="deleteIcon" :disabled="disabled" class="icon" @click="removeFile(file)"></span></div></div>
			</div>
			<div v-else>%{file:<strong>Drag a file</strong><span> or </span><a :disabled="disabled" href="javascript:void(0)" @click="browse()">browse</a> ({{value.length}})}</div>
		</slot> 
		<input ref="input" type="file" @change="selectFiles($event)" :accept="types" :multiple="!amount || amount > 1" v-show="false" />
		<slot name="messages" :messages="messages">
			<n-messages :messages="messages" v-if="messages && messages.length"/>
		</slot>
		<slot name="after" class="after">
			<div v-if="restrictionMessage" class="restriction-message">
				{{restrictionMessage}}
			</div>
		</slot>
	</div>
</template>
