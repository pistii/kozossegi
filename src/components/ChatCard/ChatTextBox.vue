<template>
    <v-text-field
        class=" bg-blue-lighten-4" 
        placeholder="Say something..."
        :label="textLabel"
        append-inner-icon="mdi-send-circle" 
        v-model="message" 
        @click:append-inner="sendMessage"
        v-on:keyup.enter="sendMessage">
        <template v-slot:prepend-inner>
            <v-icon v-if="fileUrl" x-large>mdi-attachment</v-icon>
        </template>
    </v-text-field>
</template>

<script setup>

import { ref, onMounted, onUnmounted } from 'vue';
import eventBus from '@/stores/eventBus';
import { onSendMessage } from '@/utils/MessageHelper.js';
import MessageStore from '@/stores/MessageStore.js';

const message = ref('');
const fileInfo = ref(null);

const fileUrl = ref(null);
const textLabel = ref(null);
const fileType = ref(null);
const response = ref(null);

const sendMessage = async () => {
    //parameters: message, url, mimeType, callback
    response.value = await onSendMessage(message.value, fileUrl.value, fileType.value, notifyBody);
}

const notifyBody = (resp) => {
    if (fileInfo.value !== null) { 
        const chatFile = {
            'FileType': fileInfo.value.fileType,
            'FileToken': fileInfo.value.url,
            'local': true
        }
        var combinedData = Object.assign({}, resp, { chatFile: chatFile });
        MessageStore.commit('addItemToChat', combinedData);
    }
    else {
        MessageStore.commit('addItemToChat', resp);
    } 
    //Set to default
    textLabel.value = null;
    message.value = '';
    fileUrl.value = null;
}

const addEmoji = (emoji) => {
    message.value += emoji;
}

//Sets the containsImage to the image Url if image was selected to send
const addImage = (fileData) => {
    fileInfo.value = fileData;

    fileUrl.value = fileData.url;
    textLabel.value = fileData.fileName;
    fileType.value = fileData.fileType;
}

onMounted(() => {
    eventBus.on('selectedEmoji', addEmoji); //Subscribe to the emoji picker component
    eventBus.on('chat-image-send', addImage);
})

onUnmounted(() => {
    eventBus.off('selectedEmoji', addEmoji);
    eventBus.off('chat-image-send', addImage);
})
</script>