<template>
		<div class="rel pl-6 pb-12">
			<div class="emoji_picker">
				<div class="picker_container ">
					<div v-for="category in categories" :key="`category_${category}`" >
						<span>{{ category }}</span>
						<div class="emojis_container">
							<button 
							@click="handleEmojiClick($event, emoji)" 
							v-for="(emoji, index) in category_emojis(category)" 
							:key="`emoji_${index}`"
							class="pa-1">
								{{ emoji }}
							</button>
						</div>
					</div>
				</div>	
			</div>
			<div class="bottom_arrow"></div>
		</div>
</template>

<script>

/**
 * Emoji Picker
 * Load emojis and  categories from the json file 'emojis-data.json'
 * Events:
 *  - 'emoji_click' event is fires when the user clicks on an emoji. The emoji is sent as event payload.
 * Props:
 * 	- 'show_arrow' boolean to show or not the arrow at the bottom of the picker. True by default.
 */

import data from '@/emojis-data.json';

export default {
	props:
	{
		show_arrow:
		{
			type: Boolean,
			required: false,
			default: true
		}
	},
	computed:
	{
		categories()
		{
			return Object.keys(data);
		},

		category_emojis: () => (category) =>
		{
			return Object.values(data[category]);
		}
	},
	methods:
	{
		handleEmojiClick(e, emoji)
		{
			e.preventDefault();
			this.$emit('emoji_click', emoji);
		}
	}
}
</script>

<style scoped>

.rel {
	position: absolute;
	bottom: 10%; /* A textarea mérete körülbelül, nem pontos */
}
.emoji_picker {
	border-radius: 0.5rem;
	position:relative;
	display: inline-block;
	flex-direction: column;
	width: 20rem;
	height: 20rem;
	max-width: 100%;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	overflow-y: auto;
	left: 5%;
	bottom: 0px;
	z-index: 11111;
}

.emoji_picker,
.bottom_arrow {
  	box-shadow: 0 0 5px 1px rgba(0, 0, 0, .0975);
}


.emoji_picker, .picker_container {
  	background: white;
}

.picker_container {
	position: absolute;
	padding: 1rem;
}

.bottom_arrow {
  left: 50%;
  bottom: 0;
  width: 0.75rem;
  height: 0.75rem;
  transform: translate(-50%, 50%) rotate(45deg);
}

/*
.emojis_container {
	display: flex;
	flex-wrap: wrap;
}

.emoji_picker .category button {
  margin: 0.5rem;
  margin-left: 0;
  background: inherit;
  border: none;
  font-size: 1.75rem;
  padding: 0;
} */



</style>