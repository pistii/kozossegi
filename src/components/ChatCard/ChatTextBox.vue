<template>
    <v-text-field
        class=" bg-blue-lighten-4" 
        placeholder="Say something..."
        append-inner-icon="mdi-send-circle" 
        v-model="message" 
        @click:append-inner="onSendMessage"
        v-on:keyup.enter="onSendMessage">
    </v-text-field>
</template>

<script setup>
import UserStore from '@/stores/UserStore';
import fetchData from '@/stores/server_routes';
import { ref } from 'vue';
import eventBus from '@/stores/eventBus';
import MessageStore from '@/stores/MessageStore';

const message = ref('');

const onSendMessage = async () => {
    if (message.value.length > 0) {
        var userId = UserStore.state.userId;
        var partnerId = MessageStore.getters.getPartnerId();
        let sendValue = {
            "senderId": userId,
            "authorId": userId,
            "receiverId": partnerId,
            "message": message,
            "status": 1
        }
        await fetchData.methods.fetchData('POST', "PostChatMessage", sendValue)
        .then(updateChatRoom(sendValue));
        message.value = '';
    }
};
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