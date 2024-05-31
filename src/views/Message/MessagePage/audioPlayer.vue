<template>
	<div>
		<v-menu :close-on-content-click="false">
			<template v-slot:activator="{ on }">
				<audio  style="width: 270px; height: 50px" controls>
					<source v-if="!audio.local" :src="blobToUrl(base64ToBlob(audio.fileData, 'audio/wav'))">
					<source v-else :src="audio.FileToken" >
				</audio>
			</template>
			<v-card>
				<v-card-text>
					<!-- Itt lehetnek további menüpontok -->
				</v-card-text>
			</v-card>
		</v-menu>
	</div>
</template>

<script setup>
import { base64ToBlob, blobToUrl, fileToBlob } from '@/utils/common.js';
const props = defineProps( ['audio'])

</script>
  