<template id="n-form-richtext">
	<div class="n-form-richtext">
		<div class="n-form-richtext-menu" v-if="edit">
			<button @click="bold">
				<span class="n-icon n-icon-bold"></span>
				<span class="n-form-richtext-button-description">%{text:Bold}</span>
			</button>
			<button @click="italic">
				<span class="n-icon n-icon-italic"></span>
				<span class="n-form-richtext-button-description">%{text:Italic}</span>
			</button>
			<button @click="underline">
				<span class="n-icon n-icon-underline"></span>
				<span class="n-form-richtext-button-description">%{text:Underline}</span>
			</button>
			<button @click="insertTable">
				<span class="n-icon n-icon-table"></span>
				<span class="n-form-richtext-button-description">%{text:Table}</span>
			</button>
			<button @click="link">
				<span class="n-icon n-icon-link"></span>
				<span class="n-form-richtext-button-description">%{text:Link}</span>
			</button>
			<button @click="list">
				<span class="n-icon n-icon-list"></span>
				<span class="n-form-richtext-button-description">%{text:List}</span>
			</button>
			<button @click="indent">
				<span class="n-icon n-icon-indent"></span>
				<span class="n-form-richtext-button-description">%{text:Indent}</span>
			</button>
			<button @click="outdent">
				<span class="n-icon n-icon-outdent"></span>
				<span class="n-form-richtext-button-description">%{text:Outdent}</span>
			</button>
			<button @click="clean">
				<span class="n-icon n-icon-eraser"></span>
				<span class="n-form-richtext-button-description">%{text:Plain}</span>
			</button>
		</div>
		<div @keydown.tab="tab($event)" class="n-form-richtext-content" ref="input" @paste="paste($event)" contenteditable="true" @input="$emit('input', $event.target.innerHTML)"></div>
	</div>
</template>