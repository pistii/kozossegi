<template>
    <div>
        <!--https://fireship.io/courses/vue/storage-record-voice/
            https://www.tutorialspoint.com/how-to-record-and-play-audio-in-javascript
            https://picovoice.ai/blog/how-to-record-audio-from-a-web-browser/
        -->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn v-if="!recorder" dark v-on="on" @click="record()">
                    <svg-icon type="mdi" :path="mdiPlay" class="button is-info" />
                </v-btn>
                <v-btn v-else @click="stop()" dark v-on="on">
                    <svg-icon type="mdi" :path="mdiPause" />
                </v-btn>
                <v-btn dark v-on="on">
                    <svg-icon type="mdi" :path="mdiRestart" />
                </v-btn>
                <audioPlayer v-if="newAudio" :audio="this.newAudioURL" />

            </template>
        </v-tooltip>
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPlay } from '@mdi/js'
import { mdiPlayPause } from '@mdi/js'
import { mdiPause } from '@mdi/js'
import { mdiRestart } from '@mdi/js'
import { mdiMicrophone } from '@mdi/js'
import audioPlayer from './audioPlayer.vue'

export default {
    props: {
        menuOpen: Boolean,
    },
    components: {
        SvgIcon,
        audioPlayer,
    },
    data() {
        return {
            menuOpen: false,
            newMessageText: '',
            loading: false,
            messages: [],
            newAudio: null,
            recorder: null,
            mdiMicrophone: mdiMicrophone,
            mdiPlay: mdiPlay,
            mdiPlayPause: mdiPlayPause,
            mdiPause: mdiPause,
            mdiRestart: mdiRestart,
            show: false
        }
    },
    computed: {
        newAudioURL() {
            return URL.createObjectURL(this.newAudio);
        }
    },
    methods: {
        async record() {
            this.newAudio = null;

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });

            const options = { mimeType: "audio/webm" };
            const recordedChunks = [];
            this.recorder = new MediaRecorder(stream, options);

            this.recorder.addEventListener("dataavailable", e => {
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }
            });

            this.recorder.addEventListener("stop", () => {
                this.newAudio = new Blob(recordedChunks);
            });

            this.recorder.start();
        },
        async stop() {
            this.recorder.stop();
            this.recorder = null;
        },
    },
    created() {
        this.$emit('newAudioURL');
    }
}
</script>

<style></style>