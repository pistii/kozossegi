<template>
	<div>
		<v-menu :close-on-content-click="false">
			<template v-slot:activator="{ on }">
				<audio 
					style="width: 270px; height: 50px" 
					controls 
					:src="!audio?.local ? url : audio?.fileToken">
				</audio>
			</template>
		</v-menu>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { base64ToBlob, blobToUrl } from '@/utils/common.js';
import fetchData from '@/stores/server_routes';

var url = ref(null);
var props = defineProps(['audio']);


onMounted(() => {
  getAudio();
});

async function getAudio() {
	if (!props.audio?.fileData && !props.audio?.local) {
		try {
			const file = await getFile();
			url.value = await blobToUrl(base64ToBlob(file, 'audio/wav'));
		} catch (error) {
			console.error("Failed to get file:", error);
		}
	} else if (props.audio?.fileData) {
		url.value = blobToUrl(base64ToBlob(props.audio.fileData, 'audio/wav'));
	}
}

async function getFile() {
	const file = await fetchData.methods.fetchData('GET', 'GetFile', null, props.audio?.fileToken);
	return file;
}
</script>