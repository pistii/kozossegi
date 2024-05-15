<template>
    <div>
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn v-if="!recorder" dark v-bind="on" @click="record()">
                    <v-icon class="button is-info">mdi-play</v-icon>
                </v-btn>
                <v-btn v-else @click="stop()" dark v-bind="on">
                    <v-icon>mdi-pause</v-icon>
                </v-btn>
                <v-btn dark v-bind="on">
                    <v-icon>mdi-restart</v-icon>
                </v-btn>

            </template>
        </v-tooltip>
    </div>

    <snackBar :errorMessage="this.errorMessage" v-if="this.errorMessage"/>
</template>

<script>
import snackBar from '@/components/snackBar.vue';

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

                this.$emit('newAudioCreated', audioUrl);
            });
            this.recorder.stop();
            this.recorder = null;
        },
    },
}
</script>

<style></style>