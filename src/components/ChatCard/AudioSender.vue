<template>
    <v-row no-gutters align="center">
        <v-col>
            <audioVisualizer 
                class="audio-visualizer-container" 
                :totalWidth="250"
                :newAudio="this.newAudio"
                :deleteAudio="this.delete" />
        </v-col>
        <v-col class="audio-visualizer-container justify-space-between">
            <v-tooltip text="Vissza" location="top" open-delay="1000">
                <template v-slot:activator="{ props }">
                    <v-btn class="w-100" size="x-small" v-bind="props" @click="deleteAudio()">
                        <v-icon size="20" tag="back">mdi-keyboard-backspace</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>

            <v-tooltip text="Küldés" location="top" open-delay="1000">
                <template v-slot:activator="{ props }">
                    <v-container fluid class="onHover fill-height py-3 px-1" fill-height style="height: 100%;"
                        @click="send">
                        <v-icon size="34" color="green" class="textbox-send-icon"
                            v-bind="props">mdi-send-circle</v-icon>
                    </v-container>

                </template>
            </v-tooltip>
        </v-col>
    </v-row>
</template>
<script>
import { onSendMessage } from '@/utils/MessageHelper.js';
import audioVisualizer from '@/components/audioVisualizer.vue';
import MessageStore from '@/stores/MessageStore';

export default {
    props: {
        recording: Boolean
    },
    components: {
        audioVisualizer
    },
    data() {
        return {
            newAudio: null,
            delete: false,
        }
    },
    methods: {

        insertAudio(audio) {
            this.newAudio = audio
            this.$emit('activeMenu', 'audio');
            console.log("new audio created");
            this.notifyParentAboutRecording(false);
        },

        deleteAudio() {
            this.delete = true;
            this.newAudio = null;
            this.notifyParentAboutRecording(true);
        },
        async send() {
            //message, url, mimeType, callback
            await onSendMessage(null, this.newAudio, "audio/wav", this.onFileSend);
        },
        onFileSend(response) {
            var data = response;
            var chatFile = {
                'FileToken': this.newAudio,
                'FileType': 'audio/wav',
                'local': true,
            }
            var combinedData = Object.assign({}, data, { chatFile: chatFile });
            MessageStore.commit('addItemToChat', combinedData);
            this.notifyParentAboutRecording(true);
        },
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        notifyParentAboutRecording(value) {
            this.$emit('recording', value);
        }
    },
    
    beforeDestroy() {
        URL.revokeObjectURL(this.newAudio);
    }
}
</script>

<style scoped>

.audio-visualizer-container {
    border: 1px solid #bfbdbd; 
    box-shadow: inset 0 0 20px #bfbdbd;
}

.textbox-send-icon {
    box-shadow: 0 0 10px 1px #5ad15f; 
    border-radius: 50%;
}
</style>