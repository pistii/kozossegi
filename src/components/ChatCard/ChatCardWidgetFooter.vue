<template>
    <div>
        <EmojiPicker />
        <AudioRecorder />        
    </div>
    <audioVisualizer v-if="newAudio" :newAudio="this.newAudio" />
    
    <v-text-field  
        class=" bg-blue-lighten-4" 
        placeholder="Say something..."
        append-inner-icon="mdi-send-circle" 
        v-model="messageTo" 
        @click:append-inner="onSendMessage"
        v-on:keyup.enter="onSendMessage()">
    </v-text-field>
</template>

<script>
import { nextTick } from 'vue';
import eventBus from '@/stores/eventBus';

import UserStore from '@/stores/UserStore';
import MessageStore from '@/stores/MessageStore';

import fetchData from '@/stores/server_routes';
import audioVisualizer from '@/components/audioVisualizer.vue';
import EmojiPickerComponent from '../EmojiPickerComponent.vue';
import AudioRecorder from '../AudioRecorderComponent.vue';

    export default {
        components: {
            audioVisualizer,
            EmojiPicker: EmojiPickerComponent,
            AudioRecorder
        },
        data() {
            return {
                messageTo: '',
                newAudio: null,
            }
        },
        mounted() {
            eventBus.on('newAudioCreated', this.insertAudio)
            eventBus.on('selectedEmoji', this.addEmoji) //Subscribe to the emoji picker component
        },
        methods: {                
            async onSendMessage() {
                if (this.messageTo.length > 0) {
                    var userId = UserStore.state.userId;
                    var partnerId = this.getPartnerId
                    //console.log(userId)
                    let sendValue = {
                        "senderId": userId,
                        "authorId": userId,
                        "receiverId": partnerId,
                        "message": this.messageTo,
                        "status": 1
                    }
                    //console.log("partnerId" + partnerId)
                    await fetchData.methods.fetchData('POST', "PostChatMessage", sendValue)
                    .then(resp => this.afterMessageSent(sendValue, resp));
                }
            },

            addEmoji(emoji) {
                this.messageTo += emoji;
            },
            
            afterMessageSent(message, resp) {
                if (resp === 'Message sent') {
                    MessageStore.commit('sendNewMessage', message); //TODO: Ezt az üzenetet a chatcontentbe beleteszi függetlenül attól hogy az adott content valóban a helyes szobába kerül-e. Ezt ellenőrizni kell, vagy a megfelelő szobába kell belehelyezni
                    this.messageTo = '';
                    this.stayBottom();
                    this.updateChatRoomText(message);
                }
            },
            
            scrollToBottom() {
                const container = this.$refs.parent;
                if (container != null) {
                    if (container.$el) {
                        const scrollHeight = container.$el.scrollHeight;
                        container.$el.scrollTo({ top: scrollHeight });
                    }
                }
            },
            stayBottom() {
                nextTick(() => {
                    this.scrollToBottom();
                });
            },

            insertAudio(audio) {
                this.newAudio = audio
            },
            updateChatRoomText(message) {
                //Eventbus
                eventBus.emit('updateChatRoomContent', message)
                
            },                
        },
        
        beforeDestroy() {
            eventBus.off('newAudioCreated', this.insertAudio());
            eventBus.off('selectedEmoji', this.addEmoji());
        },
    }
</script>
