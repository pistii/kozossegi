<template>
	<div class="navBarBrandName">
		<RouterLink :to="isLoggedin ? '/myProfile' : '/'" class="brandStyle">
			<span><h2 >SocialStream</h2></span>
		</RouterLink>
	</div>
</template>

<script setup>

const props = defineProps(['isLoggedin'])
</script>

<style scoped>
.navBarBrandName {
    padding: 20px;
}

.brandStyle {
	text-decoration: none; 
	color: inherit;
}
</style>