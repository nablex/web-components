<template id="n-secret">
	<span @mouseover="show = true" @mouseout="show = false">{{ show ? content : secretContent }}</span> 
</template>