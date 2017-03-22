<template id="n-tags">
	<div class="n-tags">
		<div class="n-tag" v-for="tag in tags">
			<slot :tag="tag"><span class="n-tag-title">{{ format(tag) }}</span>
			</slot><slot name="remove" :tag="tag" v-if="removable"><span class="n-tag-remove n-icon n-icon-trash" @click="remove(tag)"></span></slot>
		</div>
	</div>
</template>