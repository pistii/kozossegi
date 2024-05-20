<template>
  <div :style="{ width: totalWidth}">
    <audio 
    v-show="false" 
    ref="player" 
    @play="updatePlayState" 
    @pause="updatePlayState" 
    @ended="updatePlayState"
    @timeupdate="updateDuration" 
    @loadedmetadata="updateDuration"
    @canplay="setDuration"
    :src="newAudio" controls />

    <canvas ref="canvas" />
    <v-col>
        <div class="v-row px-2">

            <v-btn size="x-small" @click="togglePlay()">
            <v-icon>{{ getSoundPlayState }}</v-icon>
            </v-btn>

            <div class="pl-2">{{ formattedDuration }}</div>
            <div class="mx-auto" style="width:35%;" >
            <v-slider thumb-size="15"
            hide-details 
            v-model="audioDuration" 
            :max="totalDuration"
            :step="0.01">
            </v-slider>
            </div>
            <div class="pr-4">{{ formattedTotalDuration }}</div>


            <v-menu location="top" origin="auto"  open-on-hover open-on-click width="100" >
                <template v-slot:activator="{ props }">
                <v-icon
                    color="primary"
                    dark
                    v-bind="props"
                >
                {{ getAudioVolumeIcon }}
                </v-icon>
                </template>

                <v-slider 
                class="bg-blue-darken-1 pa-3 py-0 v-slider-border"
                
                thumb-color="blue-darken-4"
                    thumb-size="15" 
                    hide-details 
                    v-model="volume" 
                    @click:prepend="setAudioSound()">
                    </v-slider>
            </v-menu>

        </div>
    </v-col>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useAVLine } from 'vue-audio-visual'

const props = defineProps({
  newAudio: String,
  totalWidth: Number
})

const player = ref<HTMLAudioElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const volume = ref(100)  // Start sound value

//For slider display
let showSlider = ref(false);
//For mute
let muted = ref(false);

let audioDuration = ref(0);
let totalDuration = ref(0);

// Inicialize audio visual
useAVLine(player, canvas, {
  src: props.newAudio,
  canvHeight: 40,
  canvWidth: props.totalWidth,
  barSpace: 500,
  canvFillColor: 'gray'
})

//returns an mdi icon depending on the state of the audio
const getAudioVolumeIcon = computed(() => {
  if (volume.value >= 50) return 'mdi-volume-high';
  if (volume.value > 30) return 'mdi-volume-medium'
  if (volume.value <= 30 && volume.value > 0) return 'mdi-volume-low';
  return 'mdi-volume-off'
})

let soundPlayStateIcon = ref('mdi-play');
const getSoundPlayState = computed(() => {
  return soundPlayStateIcon.value;
})

const setAudioSound = function () {
  if (player.value) {
    if (!muted.value) {
      prevVolume.value = volume.value;
      volume.value = 0;
    }
    else {
      volume.value = prevVolume.value
      prevVolume.value = 0;
    }
    muted.value = !muted.value;
  }
}


// Watcher a volume változó figyelésére
watch(volume, (newVolume) => {
  if (player.value) {
    player.value.volume = newVolume / 100
  }
})

watch(() => props.newAudio, (newSrc) => {
      if (player.value) {
        player.value.load();
      }
    });

// Watcher a newAudio prop figyelésére, ha esetleg dinamikusan változna
watch(() => props.newAudio, (newVal) => {
  if (player.value) {
    player.value.src = String(newVal)
  }
})

// Toggle play/pause function
const togglePlay = () => {
  if (player.value) {
    if (player.value.paused) {
      player.value.play();
      soundPlayStateIcon.value = 'mdi-pause';

    } else {
      player.value.pause();
      soundPlayStateIcon.value = 'mdi-start';

    }
  }
}
const updateDuration = () => {
  if (player.value) {
    audioDuration.value = player.value.currentTime;

  }
};

const setDuration = () => {
  if (player.value) {
    totalDuration.value = player.value.duration;
  }
};

const resetDuration = () => {
    //Chrome fails to set the proper duration of the audio 
    //so in order to get it work it set to a certain time which then triggers
    //the timeupdate, and then set back the current time to 0
  if (player.value) {
    if (player.value.duration === Infinity)
    {
        player.value.currentTime = 1e101;
        setTimeout(() => {
            if (player.value)
            {
                player.value.addEventListener('timeupdate', updateDuration);
                player.value.currentTime = 0;
            }
        }, 100);
        
    }
  }
};

watch(() => audioDuration.value, (change) => {
  if (player.value && change !== Infinity) {
    console.log("change: " + change);
    const wasPlaying = !player.value.paused;
    player.value.pause();
    player.value.currentTime = change;
    if (wasPlaying) {
      player.value.play();
  }
  }
})

// Update play state when audio events occur
const updatePlayState = () => {
  if (player.value) {
    player.value.ended ? soundPlayStateIcon.value = 'mdi-play' : soundPlayStateIcon.value = 'mdi-pause';
    player.value.paused ? audioPaused() : player.value.play();
  }
}

const audioPaused = () => {
  if (player.value)
  {
    player.value.pause();
    soundPlayStateIcon.value = 'mdi-play'
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}


const formattedDuration = computed(() => formatTime(audioDuration.value));
const formattedTotalDuration = computed(() => formatTime(totalDuration.value));



onMounted(() => {
  if (player.value) {
    player.value.addEventListener('timeupdate', updateDuration);
    player.value.addEventListener('loadedmetadata', setDuration);
    player.value.addEventListener('durationchange', resetDuration);
  }
});

onUnmounted(() => {
  if (player.value) {
    player.value.removeEventListener('timeupdate', updateDuration);
    player.value.removeEventListener('loadedmetadata', setDuration);
    player.value.removeEventListener('durationchange', resetDuration);
  }
});

</script>

<style scoped>

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.v-slider-border {
  border-radius: 15px;
}
</style>