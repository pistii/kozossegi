<script setup lang="ts">
import { ref } from 'vue'
import { useAVWaveform } from 'vue-audio-visual'

const player = ref(null)
const canvas = ref(null)
const props = defineProps({
  newAudio: String
})
// composable function useAVBars
useAVWaveform(player, canvas, { 
  src: props.newAudio, 
  canvHeight: 40, 
  canvWidth: 100, 
  barColor: 'lime',
  
  
  })
</script>

<template>
  <div>
    <audio v-show="false" ref="player" :src="props.newAudio" controls />
    <canvas ref="canvas" />
  </div>
</template>