<template>
    <AudioRecorder 
    v-if="MicrophoneMenuOpen" 
    class="audioPopup"></AudioRecorder>
    <v-icon class="onHover px-6 py-3 mb-2"  
    @click="openMicrophoneDialog">
    mdi-microphone</v-icon>
</template>

<script>
import AudioRecorder from '@/views/Message/MessagePage/audioRecorder.vue'

export default {
    data() {
        return {
            MicrophoneMenuOpen: false,
            newAudio: null,

        }
    },
    components: {
        AudioRecorder
    },
    methods: {
        openMicrophoneDialog() {
            this.MicrophoneMenuOpen = !this.MicrophoneMenuOpen;
        },

    }
}
</script>


<style scoped>


.audioPopup {
    position: absolute;
    bottom: 100px;
    right: 0px;
    min-width: 100%;
    padding-left: 12px;
}
</style>