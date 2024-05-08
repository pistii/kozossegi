<template>
		<v-text-field
			class="mr-5"
			v-model="searchText"  
			:loading="loading"
			v-on:keyup.enter="search()">

			<template #append-inner>
				<v-progress-circular
					v-if="loading"
					indeterminate
					color="primary"
				></v-progress-circular>
				<v-icon @click="search()" 
					style="font-size: 19.5px"
					:disabled="loading" 
					 v-else>mdi-magnify
				</v-icon>
			</template>

		</v-text-field>
</template>

<script setup>
import { ref } from 'vue';
import fetchData from '@/stores/server_routes';
import store from '@/stores/UserStore';
import { useRouter } from 'vue-router';
import eventBus from '@/stores/eventBus.js';

var searchText = '';
var loading = ref(false);
const router = useRouter();


async function search() {
	if (searchText !== "") {
		loading.value = true;

		await fetchData.methods.fetchData('GET', 'Search', null, store.state.userId, this.searchText)
		.then((val) => { 
			console.log(val)
			setTimeout(() => {
				eventBus.emit('searchResult', val);
				router.push({ path: '/searchResult' });
				
				//Notify UI
				searchText = '';
				loading.value = false;
			}, 100);
			
		});
	};
};

</script>
