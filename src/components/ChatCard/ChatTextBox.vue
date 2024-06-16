<template>
    <v-text-field
        class=" bg-blue-lighten-4" 
        maxLength="800"
        placeholder="Say something..."
        v-model="message" 
        :label="textLabel"
        append-inner-icon="mdi-send-circle" 
        :append-icon="textLabel ? 'mdi-delete-circle' : undefined"
        @click:append="removeFile"
        @click:append-inner="sendMessage"
        v-on:keyup.enter="sendMessage">
        <template v-slot:prepend-inner>
            <v-icon v-if="fileUrl" x-large>mdi-attachment</v-icon>
        </template>
    </v-text-field>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import eventBus from '@/stores/eventBus';
import { onSendMessage } from '@/utils/MessageHelper.js';
import MessageStore from '@/stores/MessageStore.js';
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps(['userId', 'selectedEmoji']);;

const message = ref('');
const fileInfo = ref(null);
const fileUrl = ref(null);
const textLabel = ref(null);
const fileType = ref(null);

//watcher for emoji change in case of if the emoji was selected from one specific component.
watch(props, (prop) => {
    message.value += prop.selectedEmoji;
}, { deep: true });

//Message sending collaborate here. 
const sendMessage = async () => {
    if (message.value || fileUrl.value) 
        await onSendMessage(message.value, props.userId, fileUrl.value, fileType.value, notifyOverlayBody);
};

const removeFile = () => {
    URL.revokeObjectURL(fileUrl.value);
    textLabel.value = null;
    fileUrl.value = null;
    fileType.value = null;
    fileInfo.value = null;
}

//Audio sending is not implemented here, instead in audioSender
const notifyOverlayBody = (resp) => {
    const currentPath = router.currentRoute.value.name;
    console.log("file sending callback");
    
    if (fileInfo.value !== null) { 
        const chatFile = {
            'fileType': fileInfo.value.fileType,
            'fileToken': fileInfo.value.url,
            'local': true
        }
        const receiverId = props.userId;
        const respWReceiverId = Object.assign({}, resp, {receiverId});
        var combinedData = Object.assign({}, respWReceiverId, { chatFile });
        MessageStore.dispatch('insertMessage', combinedData);//Notify the overlays
        console.log("current path: " + currentPath);
        if (currentPath === 'message') {
            console.log("notify mv" + JSON.stringify(combinedData));
            eventBus.emit('new-message', combinedData); //notify to add data to view
        }        
    }
    else {
        console.log("response from server: " + JSON.stringify(resp));
        MessageStore.dispatch('insertMessage', resp); //Notify the overlays

        if (currentPath === 'message') {
            eventBus.emit('new-message', resp); //notify to add data to view
        }
    } 
    //Set to default
    textLabel.value = null;
    message.value = '';
    fileUrl.value = null;
    fileInfo.value = null;
};

//Sets the containsImage to the image Url if image was selected to send
const addImage = (fileData) => {
    //console.log(fileData);
    fileInfo.value = fileData;

    fileUrl.value = fileData.url;
    textLabel.value = fileData.fileName;
    fileType.value = fileData.fileType;
};

onMounted(() => {
    eventBus.on('chat-image-send', addImage);
});

onUnmounted(() => {
    eventBus.off('chat-image-send', addImage);

});
</script>