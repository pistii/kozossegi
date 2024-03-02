<template>
	<RouterLink to="/myProfile" class="pa-1">
		<v-badge color="transparent"  class="pa-1">
			<v-icon>mdi-home-circle</v-icon>
		</v-badge>
	</RouterLink>
	<RouterLink to="/searchPeople"  class="pa-1">
		<v-badge content="1" color="error"  class="pa-1">
			<v-icon class="pa-1">mdi-account-group</v-icon>
		</v-badge>
	</RouterLink>
	<RouterLink to="/messages" class="pa-1">
		<v-badge 
		class="pa-1"
		:color="messageLen>0 ? 'error' : 'transparent'"
		:content="messageLen>0 ? 
		messageLen : undefined" >
			<v-icon>mdi-message-bulleted</v-icon>
		</v-badge>
	</RouterLink>
	<navNotification />
</template>

<script setup>
import { computed } from 'vue';
import store from '@/stores/UserStore';
import navNotification from './navNotification.vue'
 
const messageLen = computed(() => {
	return store.getters.messageHubLen()
})
</script>
