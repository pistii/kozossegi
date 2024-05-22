<template>
    <v-text-field
        class=" bg-blue-lighten-4" 
        placeholder="Say something..."
        append-inner-icon="mdi-send-circle" 
        v-model="message" 
        @click:append-inner="sendMessage"
        v-on:keyup.enter="sendMessage">
    </v-text-field>
</template>

<script setup>

import { ref, onMounted, onUnmounted } from 'vue';
import eventBus from '@/stores/eventBus';
import { onSendMessage } from '@/utils/MessageHelper.js'

const message = ref('');

const sendMessage = async () => {
    //parameters: message, url, callback
    await onSendMessage(message.value, null, updateChatRoom);
}

const updateChatRoom = (data) => {
    message.value = '';
    eventBus.emit('updateChatRoom', data)
}

const addEmoji = (emoji) => {
    message.value += emoji;
}

onMounted(() => {
    eventBus.on('selectedEmoji', addEmoji) //Subscribe to the emoji picker component
})

onUnmounted(() => {
    eventBus.off('selectedEmoji', addEmoji);
})
</script>