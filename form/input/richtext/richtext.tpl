<template id="n-form-richtext">
	<div class="is-form-richtext" v-auto-close="function() { focused = false }">
		<div class="is-label-wrapper" v-if="label || info">
			<label class="is-label" v-if="label"><span class="is-label-content" v-html="label"></span><n-info :icon="infoIcon" v-if="info"><span v-html="info"></span></n-info></label>
		</div>
		<div class="is-content-before" v-if="before" v-html="before"></div>
		<ul class="is-menu is-variant-toolbar" v-if="edit">
			<li class="is-column">
				<span class="is-button is-size-xsmall is-variant-primary"><icon name="th-large"/><span class="is-text">%{component-text::Block}</span></span>
				<ul class="is-row">
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="wrap('p')"><icon name="paragraph"/><span class="is-text">%{component-text::Paragraph}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="wrap('h1')"><icon name="heading"/><span class="is-text">%{component-text::H1}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="wrap('h2')"><icon name="heading"/><span class="is-text">%{component-text::H2}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="wrap('h3')"><icon name="heading"/><span class="is-text">%{component-text::H3}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="wrap('h4')"><icon name="heading"/><span class="is-text">%{component-text::H4}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="wrap('h5')"><icon name="heading"/><span class="is-text">%{component-text::H5}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="wrap('h6')"><icon name="heading"/><span class="is-text">%{component-text::H6}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="link"><icon name="link"/><span class="is-text">%{component-text::Link}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="insertTable"><icon name="table"/><span class="is-text">%{component-text::Table}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="list"><icon name="list"/><span class="is-text">%{component-text::List}</span></button></li>
				</ul>
			</li>
			<li class="is-column">
				<span class="is-button is-size-xsmall is-variant-primary"><icon name="align-justify"/><span class="is-text">%{component-text::Justify}</span></span>
				<ul class="is-row">
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="justify('justifyCenter')"><icon name="align-center"/><span class="is-text">%{component-text::Center}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="justify('justifyLeft')"><icon name="align-left"/><span class="is-text">%{component-text::Left}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="justify('justifyRight')"><icon name="align-right"/><span class="is-text">%{component-text::Right}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="justify('justifyFull')"><icon name="align-justify"/><span class="is-text">%{component-text::Full}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="indent"><icon name="indent"/><span class="is-text">%{component-text::Indent}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="outdent"><icon name="outdent"/><span class="is-text">%{component-text::Outdent}</span></button></li>
				</ul>
			</li>
			<li class="is-column">
				<span class="is-button is-size-xsmall is-variant-primary"><icon name="font"/><span class="is-text">%{component-text::Decoration}</span></span>
				<ul class="is-row">
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="bold"><icon name="bold"/><span class="is-text">%{component-text::Bold}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="italic"><icon name="italic"/><span class="is-text">%{component-text::Italic}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="underline"><icon name="underline"/><span class="is-text">%{component-text::Line}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="clean"><icon name="eraser"/><span class="is-text">%{component-text::Plain}</span></button></li>
					<li class="is-column"><button class="is-button is-variant-secondary is-size-xsmall" @click="applyColor()"><icon name="paint-brush"/><span class="is-text">%{component-text::Paint}</span></button></li>
					<li class="is-column is-height-min-2 is-align-stretch"><input type="color" v-model="color" class="is-content is-color-secondary is-width-max"></li>
				</ul>
			</li>
		</ul>
		<div class="is-content-wrapper">
			<div @keydown.tab="tab($event)" class="is-inline-editor" placeholder="Rich text" v-html-once="value ? value : ''" ref="editor" @paste="paste($event)" :contenteditable="edit" @keyup="update" @blur="update" @input="update"></div>
		</div>
		<n-messages :messages="messages" v-if="messages && messages.length"/>
		<div class="is-content-after" v-if="after" v-html="after"></div>
	</div>
</template>

