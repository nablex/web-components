<template id="n-form-richtext">
	<div class="n-form-richtext n-form-component" v-auto-close="function() { focused = false }">
		<slot name="top"></slot>
		<div class="n-form-label-wrapper" v-if="label || info">
			<slot name="label" :label="label" :mandatory="mandatory">
				<label class="n-form-label" :class="{ 'n-form-input-required': mandatory }" v-if="label" v-html="label"></label>
			</slot>
			<n-info class="n-form-label-info" v-if="info"><span v-html="info"></span></n-info>
		</div>
		<slot name="before" :content="before">
			<div class="n-form-component-before" v-if="before" v-html="before"></div>
		</slot>
		<div class="n-form-richtext-menu" v-if="edit && focused" v-auto-close="function() { showBlock = false; showJustify = false; showDecoration = false; }">
			<div class="n-form-richtext-menu-container" @click="focused = true" v-auto-close.block="function() { showBlock = false }">
				<div class="n-form-richtext-menu-container" @click="focused = true" v-auto-close.block="function() { showBlock = false }">
					<button @click="function () {showRawHtml = !showRawHtml}">
						<span class="n-icon fa n-icon-code-large fa-code"></span>
						<span class="n-form-richtext-button-description">%{text:RAW}</span>
					</button>
				</div>
				<button @click="showBlock = !showBlock">
					<span class="n-icon fa n-icon-th-large fa-th-large"></span>
					<span class="n-form-richtext-button-description">%{text:Block}</span>
				</button>
				<div v-if="showBlock" class="n-form-richtext-choices">
					<button @click="wrap('p')">
						<span class="n-icon fa n-icon-paragraph fa-paragraph"></span>
						<span class="n-form-richtext-button-description">%{text:Block}</span>
					</button
					><button @click="wrap('h1')">
						<span class="n-icon fa n-icon-header fa-heading"></span>
						<span class="n-form-richtext-button-description">%{text:H1}</span>
					</button
					><button @click="wrap('h2')">
						<span class="n-icon fa n-icon-header fa-heading"></span>
						<span class="n-form-richtext-button-description">%{text:H2}</span>
					</button
					><button @click="wrap('h3')">
						<span class="n-icon fa n-icon-header fa-heading"></span>
						<span class="n-form-richtext-button-description">%{text:H3}</span>
					</button
					><button @click="wrap('h4')">
						<span class="n-icon fa n-icon-header fa-heading"></span>
						<span class="n-form-richtext-button-description">%{text:H4}</span>
					</button
					><button @click="wrap('h5')">
						<span class="n-icon fa n-icon-header fa-heading"></span>
						<span class="n-form-richtext-button-description">%{text:H5}</span>
					</button
					><button @click="wrap('h6')">
						<span class="n-icon fa n-icon-header fa-heading"></span>
						<span class="n-form-richtext-button-description">%{text:H6}</span>
					</button><button @click="insertTable">
						<span class="n-icon fa n-icon-table fa-table"></span>
						<span class="n-form-richtext-button-description">%{text:Table}</span>
					</button><button @click="link">
						<span class="n-icon fa n-icon-link fa-link"></span>
						<span class="n-form-richtext-button-description">%{text:Link}</span>
					</button>
				</div>
			</div>
			<div class="n-form-richtext-menu-container"  v-auto-close.block="function() { showJustify = false }">
				<button @click="showJustify = !showJustify">
					<span class="n-icon fa n-icon-align-justify fa-align-justify"></span>
					<span class="n-form-richtext-button-description">%{text:Justify}</span>
				</button>
				<div v-if="showJustify" class="n-form-richtext-choices">
					<button @click="justify('justifyCenter')">
						<span class="n-icon fa n-icon-align-center fa-align-center"></span>
						<span class="n-form-richtext-button-description">%{text:Center}</span>
					</button
					><button @click="justify('justifyLeft')">
						<span class="n-icon fa n-icon-align-left fa-align-left"></span>
						<span class="n-form-richtext-button-description">%{text:Left}</span>
					</button
					><button @click="justify('justifyRight')">
						<span class="n-icon fa n-icon-align-right fa-align-right"></span>
						<span class="n-form-richtext-button-description">%{text:Right}</span>
					</button
					><button @click="justify('justifyFull')">
						<span class="n-icon fa n-icon-align-justify fa-align-justify"></span>
						<span class="n-form-richtext-button-description">%{text:Full}</span>
					</button><button @click="list">
						<span class="n-icon fa n-icon-list fa-list"></span>
						<span class="n-form-richtext-button-description">%{text:List}</span>
					</button><button @click="indent">
						<span class="n-icon fa n-icon-indent fa-indent"></span>
						<span class="n-form-richtext-button-description">%{text:Indent}</span>
					</button><button @click="outdent">
						<span class="n-icon fa n-icon-outdent fa-outdent"></span>
						<span class="n-form-richtext-button-description">%{text:Outdent}</span>
					</button>
				</div>
			</div>
			<div class="n-form-richtext-menu-container"  v-auto-close.block="function() { showDecoration = false }">
				<button @click="showDecoration = !showDecoration">
					<span class="n-icon fa n-icon-font fa-font"></span>
					<span class="n-form-richtext-button-description">%{text:Decoration}</span>
				</button>
				<div v-if="showDecoration" class="n-form-richtext-choices">
					<button @click="bold()">
						<span class="n-icon fa n-icon-bold fa-bold"></span>
						<span class="n-form-richtext-button-description">%{text:Bold}</span>
					</button><button @click="italic">
						<span class="n-icon fa n-icon-italic fa-italic"></span>
						<span class="n-form-richtext-button-description">%{text:Italic}</span>
					</button><button @click="underline">
						<span class="n-icon fa n-icon-underline fa-underline"></span>
						<span class="n-form-richtext-button-description">%{text:Line}</span>
					</button><button @click="clean">
						<span class="n-icon fa n-icon-eraser fa-eraser"></span>
						<span class="n-form-richtext-button-description">%{text:Plain}</span>
					</button><input type="color" v-model="color"><button @click="applyColor()">
						<span class="n-icon fa n-icon-paint-brush fa-paint-brush"></span>
						<span class="n-form-richtext-button-description">%{text:Paint}</span>
					</button>
				</div>
			</div></div>
		<div class="n-form-richtext-editor">
			<div v-if="!showRawHtml" @focus="focused = true" @keydown.tab="tab($event)" class="n-form-richtext-content" v-html-once="value ? value : ''" ref="input" @paste="paste($event)" :contenteditable="edit" @keyup="update" @blur="update" @input="update"></div>
			<n-form-text type="area" v-if="showRawHtml" v-model="value" @focus="focused = true" @keydown.tab="tab($event)" class="n-form-richtext-content" ref="input" @paste="paste($event)" :contenteditable="edit" @keyup="update" @blur="update" @input="update"/>
			<span class="n-input-result n-icon" :class="{'n-icon-check': valid != null && valid, 'n-icon-times': valid != null && !valid }" v-show="valid != null && edit"></span>
		</div>
		<slot name="messages" :messages="messages">
			<n-messages :messages="messages" v-if="messages && messages.length"/>
		</slot>
		<slot name="after" :content="after">
			<div class="n-form-component-after" v-if="after" v-html="after"></div>
		</slot>
		<slot name="bottom"></slot>
	</div>
</template>

