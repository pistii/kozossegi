<template>
    <v-row no-gutters align="center">
        <v-col>
            <audioVisualizer 
                class="audio-visualizer-container" 
                :totalWidth="250"
                :newAudio="this.url"
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
import eventBus from '@/stores/eventBus.js';


export default {
    props: {
        userId: Number,
        url: String
    },
    components: {
        audioVisualizer
    },
    data() {
        return {
            delete: false,
        }
    },
    methods: {
        deleteAudio() {
            this.delete = true;
            this.url = null;
            this.notifyParentAboutRecording();
        },
        async send() {
            //message, partner, url, mimeType, callback
            await onSendMessage(null, this.userId, this.url, "audio/wav", this.onFileSend);
        },
        onFileSend(response) {
            const currentPath = this.$route.name;
            var data = response;
            var chatFile = {
                'fileToken': this.url,
                'fileType': 'audio/wav',
                'local': true,
            }
            var combinedData = Object.assign({}, data, { chatFile });
            let activeChat = MessageStore.getters.getActiveChat();
            if (activeChat !== undefined && currentPath == 'message') { //if there is open chat AND currentPath is MV
                if (MessageStore.getters.getActiveChat().user.id === this.userId) {
                    MessageStore.commit('addItemToChat', combinedData);
                }
                eventBus.emit('new-message', combinedData);
            }
            else if (activeChat !== undefined) //If there is open chat
            {
                if (MessageStore.getters.getActiveChat().user.id === this.userId) {
                    MessageStore.commit('addItemToChat', combinedData);
                }
            } else if (currentPath == 'message') { //add data to MessageView
                eventBus.emit('new-message', combinedData);
            }
            this.notifyParentAboutRecording();
        },
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        notifyParentAboutRecording() {
            this.$emit('recording', true);
        }
    },
    
    beforeDestroy() {
        URL.revokeObjectURL(this.url);
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