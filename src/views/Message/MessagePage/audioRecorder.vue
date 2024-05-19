<template>
    <v-sheet class="bg-blue-lighten-3 text-center" >
        <div 
        v-if="!recorder"
        class="py-3">
            <v-icon 
            style="border-radius: 50%;"
            class="bg-grey"
            size="40"
            @click="record()">mdi-microphone</v-icon>
        </div>

        <div v-else class="py-3">
            <v-icon
            @click="stop()"
            style="border-radius: 50%;"
            class="bg-grey"
            size="40">mdi-microphone</v-icon>
            <div>Recording...</div>
        </div>
        <snackBar v-if="this.errorMessage" :errorMessage="this.errorMessage" />
    </v-sheet>
</template>

<script>
import snackBar from '@/components/snackBar.vue';
import eventBus from '@/stores/eventBus';

const recordedChunks = [];


export default {
    components: {
        snackBar,
    },
    props: {
        menuOpen: Boolean,
    },
    data() {
        return {
            newAudio: null,
            recorder: null,
            show: false,
            errorMessage: null,
            errorMessageDescription: null,
        }
    },
    methods: {
        async record() {
            if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
                this.errorMessage = "Feature is not supported by browser";
                return Promise.reject(new Error("Feature is not supported by browser")
            
            );
            }
            this.newAudio = null;
            navigator.mediaDevices.getUserMedia({ audio: true })
             .then(stream => {
            
                this.recorder = new MediaRecorder(stream);

                this.recorder.addEventListener("dataavailable", e => {
                    if (e.data.size > 0) {
                        recordedChunks.push(e.data);
                    }
                });

                this.recorder.start();
            }).catch(error => {
                switch (error.name) {
                    case 'NotAllowedError': 
                        this.errorMessage = "No microphone permission granted.";
                        this.errorMessageDescription = "Please enable microphone in order to start voice recording..";
                    case "NotReadableError":
                        this.errorMessage = "A problem occured with the file.";
                        this.errorMessageDescription = "Please try again.";
                    case "NotFoundError":
                        this.errorMessage = "Recording not found";
                        this.errorMessageDescription = "Please try again.";
                }
            })
        },

        async stop() {
            
            this.recorder.addEventListener("stop", () => {
                const blobObj = new Blob(recordedChunks, {'type': 'audio/mp3'} );
                const audioUrl = URL.createObjectURL(blobObj);

                eventBus.emit('newAudioCreated', audioUrl);
            });
            this.recorder.stop();
            this.recorder = null;
        },
        async clear() {
            this.recorder.stop();
            this.recorder = null;
        }
    },
}

</script>

<style>
.voice-recorder {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.ripple-container {
  position: relative;
  width: 200px;
  height: 200px;
  background-color: lightblue;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
  background-color: rgba(0, 0, 0, 0.4);
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

</style>