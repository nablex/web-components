<template id="n-form-richtext">
	<div class="n-form-richtext n-form-component">
		<div class="n-form-richtext-menu" v-if="edit" v-auto-close="function() { showBlock = false; showJustify = false; }"><button @click="showBlock = !showBlock">
				<span class="n-icon fa n-icon-th-large fa-th-large"></span>
				<span class="n-form-richtext-button-description">%{text:Block}</span>
				<div v-if="showBlock" class="n-form-richtext-choices">
					<button @click="wrap('p')">
						<span class="n-icon fa n-icon-paragraph fa-paragraph"></span>
						<span class="n-form-richtext-button-description">%{text:Paragraph}</span>
					</button>
					<button @click="wrap('h1')">
						<span class="n-icon fa n-icon-header fa-header"></span>
						<span class="n-form-richtext-button-description">%{text:H1}</span>
					</button>
					<button @click="wrap('h2')">
						<span class="n-icon fa n-icon-header fa-header"></span>
						<span class="n-form-richtext-button-description">%{text:H2}</span>
					</button>
					<button @click="wrap('h3')">
						<span class="n-icon fa n-icon-header fa-header"></span>
						<span class="n-form-richtext-button-description">%{text:H3}</span>
					</button>
					<button @click="wrap('h4')">
						<span class="n-icon fa n-icon-header fa-header"></span>
						<span class="n-form-richtext-button-description">%{text:H4}</span>
					</button>
					<button @click="wrap('h5')">
						<span class="n-icon fa n-icon-header fa-header"></span>
						<span class="n-form-richtext-button-description">%{text:H5}</span>
					</button>
					<button @click="wrap('h6')">
						<span class="n-icon fa n-icon-header fa-header"></span>
						<span class="n-form-richtext-button-description">%{text:H6}</span>
					</button>
				</div>
			</button><button @click="showJustify = !showJustify">
				<span class="n-icon fa n-icon-align-justify fa-align-justify"></span>
				<span class="n-form-richtext-button-description">%{text:Justify}</span>
				<div v-if="showJustify" class="n-form-richtext-choices">
					<button @click="justify('justifyCenter')">
						<span class="n-icon fa n-icon-align-center fa-align-center"></span>
						<span class="n-form-richtext-button-description">%{text:Center}</span>
					</button>
					<button @click="justify('justifyLeft')">
						<span class="n-icon fa n-icon-align-left fa-align-left"></span>
						<span class="n-form-richtext-button-description">%{text:Left}</span>
					</button>
					<button @click="justify('justifyRight')">
						<span class="n-icon fa n-icon-align-right fa-align-right"></span>
						<span class="n-form-richtext-button-description">%{text:Right}</span>
					</button>
					<button @click="justify('justifyFull')">
						<span class="n-icon fa n-icon-align-justify fa-align-justify"></span>
						<span class="n-form-richtext-button-description">%{text:Full}</span>
					</button>
				</div>
			</button><button @click="bold()">
				<span class="n-icon fa n-icon-bold fa-bold"></span>
				<span class="n-form-richtext-button-description">%{text:Bold}</span>
			</button><button @click="italic">
				<span class="n-icon fa n-icon-italic fa-italic"></span>
				<span class="n-form-richtext-button-description">%{text:Italic}</span>
			</button><button @click="underline">
				<span class="n-icon fa n-icon-underline fa-underline"></span>
				<span class="n-form-richtext-button-description">%{text:Underline}</span>
			</button><button @click="insertTable">
				<span class="n-icon fa n-icon-table fa-table"></span>
				<span class="n-form-richtext-button-description">%{text:Table}</span>
			</button><button @click="link">
				<span class="n-icon fa n-icon-link fa-link"></span>
				<span class="n-form-richtext-button-description">%{text:Link}</span>
			</button><button @click="list">
				<span class="n-icon fa n-icon-list fa-list"></span>
				<span class="n-form-richtext-button-description">%{text:List}</span>
			</button><button @click="indent">
				<span class="n-icon fa n-icon-indent fa-indent"></span>
				<span class="n-form-richtext-button-description">%{text:Indent}</span>
			</button><button @click="outdent">
				<span class="n-icon fa n-icon-outdent fa-outdent"></span>
				<span class="n-form-richtext-button-description">%{text:Outdent}</span>
			</button><button @click="clean">
				<span class="n-icon fa n-icon-eraser fa-eraser"></span>
				<span class="n-form-richtext-button-description">%{text:Plain}</span>
			</button><input type="color" v-model="color"><button @click="applyColor()">
				<span class="n-icon fa n-icon-paint-brush fa-paint-brush"></span>
				<span class="n-form-richtext-button-description">%{text:Paint}</span>
			</button></div>
		<div class="n-form-richtext-editor">
			<div @keydown.tab="tab($event)" class="n-form-richtext-content" v-html-once="value" ref="input" @paste="paste($event)" :contenteditable="edit" @keyup="$emit('input', $event.target.innerHTML)" @blur="$emit('input', $event.target.innerHTML)" @input="$emit('input', $event.target.innerHTML)"></div>
			<span class="n-input-result n-icon" :class="{'n-icon-check': valid != null && valid, 'n-icon-times': valid != null && !valid }" v-show="valid != null && edit"></span>
		</div>
	</div>
</template>