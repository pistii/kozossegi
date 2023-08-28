<template>
	<div>
		<v-menu :close-on-content-click="false">
			<template v-slot:activator="{ on }">
				<audio controls>
					<source src="audio_url" type="audio/mpeg">
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
  