<template id="n-form-image-uploader">
	<div class="is-form-image-uploader" ref="form" 
			:class="{'has-selected': selectedImage != null, 'has-no-selected': selectedImage == null, 'is-read-only': readOnly, 'is-valid': valid != null && valid, 'is-invalid': valid != null && !valid, 'is-optional': !field.minimum, 'is-mandatory': field.minimum != null && field.minimum > 1, 'is-form-image-uploader-singular': singular, 'is-form-image-uploader-multiple': !singular, 'is-form-image-uploader-mixed': field.allowNonImages }">
		<div class="is-label-wrapper" v-if="field.label || field.info">
			<label class="is-label" v-if="field.label"><span class="is-label-content" v-html="$services.page.translate(field.label)"></span><n-info :icon="field.infoIcon" v-if="field.info"><span v-html="$services.page.translate(field.info)"></span></n-info></label>
		</div>
		<div class="is-content-before" v-if="field.before" v-html="$services.page.translate(field.before)"></div>
		<div class="is-content-wrapper is-row is-image-container" :class="getChildComponentClasses('image-container')">
			<template v-if="!singular">
				<div v-for="(image, index) in value" class="is-column has-button-close" :class="getChildComponentClasses('image-entry-wrapper')">
					<img class="is-image" v-if="image[typeField].indexOf('image/') == 0" :src="image.$url" @click="selectedImage = image"
						:title="image[nameField]"
						:class="[getChildComponentClasses('image-entry'), {'is-selected': selectedImage == image }]"/>
					<h6 v-if="field.showFileNames" class="is-h6" :class="getChildComponentClasses('image-title')">{{image[nameField]}}</h6>
					<button class="is-button is-variant-close is-size-small is-color-danger" @click="remove(index)" v-if="!readOnly"><icon name="times"/></button>
				</div>
			</template>
			<div class="is-column has-button-close" v-else-if="value && value.$url" :class="getChildComponentClasses('image-entry-wrapper')">
				<img class="is-image" v-if="value[typeField].indexOf('image/') == 0" :src="value.$url" :class="getChildComponentClasses('image-entry')" />
				<h6 v-if="field.showFileNames" class="is-h6" :class="getChildComponentClasses('image-title')">{{image[nameField]}}</h6>
				<button class="is-button is-variant-close is-size-small is-color-danger" @click="remove()" v-if="!readOnly"><icon name="times"/></button>
			</div>
			<n-input-file :types='fileTypes' ref='form' :amount='remaining > 1 ? remaining : 1'
				v-if="!readOnly"
				@change='changed'
				:value='files'
				:name='field.name'
				:dropLabel='field.dropLabel ? $services.page.translate(field.dropLabel) : null'
				:browseLabel='field.browseLabel ? $services.page.translate(field.browseLabel) : null'
				:browseIcon='field.browseIcon'
				:deleteIcon='field.deleteIcon'
				:visualize-file-names="false"
				class="is-column"
				:class="getChildComponentClasses('file-input')"
				:button-class="getChildComponentClasses('file-input-button')"
				/>
		</div>
		<div v-if="readOnly && field.showLargeSelectedReadOnly" class="is-column" :class="getChildComponentClasses('image-hero-wrapper')">
			<img class="is-image" v-if="selectedImage && selectedImage[typeField].indexOf('image/') == 0" :src="selectedImage.$url" :class="getChildComponentClasses('image-hero')" />
			<img class="is-image" v-else-if="field.emptyImage" :src="field.emptyImage" :class="getChildComponentClasses('image-hero')"/>
			<div v-else-if="selectedImage" class="description">{{selectedImage[nameField]}}</div>
		</div>
		<div v-else-if="(singular && !value.$url) || (!singular && value.length == 0)" class="file-empty">
			<img class="is-image" v-if="field.emptyImage" :src="field.emptyImage"/>
			<div v-else-if="field.emptyText" class="no-data">{{$services.page.translate(field.emptyText)}}</div>
		</div>
		<n-messages :messages="messages" v-if="messages && messages.length"/>
		<div class="is-content-after" v-if="field.after" v-html="$services.page.translate(field.after)"></div>
	</div>
</template>

<template id="n-form-image-uploader-configure">
	<div>
		<n-form-text placeholder="1024" v-model="field.maxResolution" label="Maximum pixel dimension" info="This defaults to 1024, if you want unlimited pictures, set to 0" :timeout="600"/>
		<n-form-text label='Label drop' v-model='field.dropLabel' :timeout="600"/>
		<n-form-text label='Label browse' v-model='field.browseLabel' :timeout="600"/>
		<n-form-text label='Icon browse' v-model='field.browseIcon' :timeout="600"/>
		<n-form-text label='Minimum amount' v-model='field.minimum' :timeout="600"/>
		<n-form-text label='Maximum amount' v-model='field.maximum' :timeout="600"/>
		<n-form-text v-if="!field.emptyText" label='Empty read-only placeholder image' v-model='field.emptyImage' info="The image to show in the main spot when in read-only mode if none has been selected" :timeout="600"/>
		<n-form-text v-if="!field.emptyImage" label='Empty read-only placeholder text' v-model='field.emptyText' info="The text to show in the main spot when in read-only mode if none has been selected" :timeout="600"/>
		<n-form-switch label="Allow non-image files" v-model="field.allowNonImages"/>
		<n-form-switch label="Show large selected in read-only mode" v-model="field.showLargeSelectedReadOnly"/>
		<n-form-switch label="Show file names" v-model="field.showFileNames"/>
	</div>
</template> 