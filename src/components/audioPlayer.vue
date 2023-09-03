<template>
	<div>
		<v-menu :close-on-content-click="false">
			<template v-slot:activator="{ on }">
				<audio controls>
					<source :src="audio" type="audio/webm">
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

<script>
export default {
	props: 
		['audio']
	
}
</script>
  