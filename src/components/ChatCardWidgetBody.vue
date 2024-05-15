<template>
    <v-col>
        <v-col class="bg-blue-lighten-4" 
        style=" padding-inline: 0px; padding-bottom: 0px" >
            <div>
                <v-progress-circular
                    :width="3"
                    color="blue"
                    indeterminate
                    v-show="loadMoreMessage_Progress" 
                >
                </v-progress-circular>
            </div>

            <v-sheet 
            class="messaging_area scrollbar scroll_msg_pane mb-3"
            v-if="getChatContent.length>0" ref="parent">
                <Observer @intersect="handleIntersection" 
                    :options="{ threshold: 0 }" />
                <span v-for="(message, index) in getChatContent" :key="index">
                    <chat-msg-comp  :msg="message" />
                </span>
            </v-sheet>
            <v-container v-else><p>Még nincs megjelenítendő beszélgetés...</p></v-container>
            
            <v-row class="chatCardFooter ">
                <v-row class="bg-blue-lighten-1 bg-red mx-0">
                    <EmojiPicker 
                    v-if="EmojiVisible" 
                    @emoji_click="handleEmojiClick" />
                    <v-icon 
                    class="px-6 py-3 mb-2"
                    @click="onEmojiPicker">mdi-emoticon</v-icon>
                    <AudioRecorder 
                    v-if="menuOpen" 
                    class="audioPopup"
                    @newAudioCreated="insertAudio"></AudioRecorder>

                    <v-icon class="onHover"  
                    @click="openMicrophoneDialog">
                    mdi-microphone</v-icon>
                </v-row>
                <div class="messageBox">

                    <composable v-if="newAudio" :newAudio="this.newAudio" />
                    <v-text-field  class=" pt-2" 
                        placeholder="Say something..."
                        append-inner-icon="mdi-send-circle" 
                        v-model="messageTo" 
                        @click:append-inner="onSendMessage"
                        v-on:keyup.enter="onSendMessage()">
                    </v-text-field>
                </div>
            </v-row>
        </v-col>
    </v-col>
</template>

<script>
import MessageStore from '@/stores/MessageStore';
import UserStore from '@/stores/UserStore';

import { mdiMicrophone, mdiEmoticon } from '@mdi/js'
import json from '@/emojis-data.json'
import EmojiPicker from '@/views/Message/MessagePage/EmojiPicker.vue'
import ChatMessageComponent from '@/views/Message/MessagePage/ChatMessageComponent.vue'
import AudioRecorder from '@/views/Message/MessagePage/audioRecorder.vue'
import audioPlayer from '@/views/Message/MessagePage/audioPlayer.vue'
import Observer from '@/components/Observer.vue'
import { ref, nextTick, onMounted } from 'vue';
import eventBus from '@/stores/eventBus';

import fetchData from '@/stores/server_routes';
import composable from './composable.vue'

//import EmojiPicker from '@/zaichaopan/emoji-picker';

const loadMoreMessage_Progress = ref(false);

export default {
    props: {
        containerHeight: Number
    },  
    components: {
        EmojiPicker,
        AudioRecorder,
        audioPlayer,
        'chat-msg-comp' : ChatMessageComponent,
        Observer,
        composable,
    },
    mounted() {
        eventBus.on('new-message', this.stayBottom);
    },
    setup() {
        const loadMoreMessage = async () => {
            var pageNum = MessageStore.getters.getCurrentPage()+1;
            MessageStore.commit('setCurrentPage', pageNum);
            
            await fetchData.methods
            .fetchData('GET', 'GetChatContent', null, MessageStore.getters.getCurrentRoomId(), pageNum)
            .then(resp => MessageStore.commit('sendNewMessage', resp));
            
        }
        const handleIntersection = () => {
            //console.log("totalPages: " + MessageStore.getters.getTotalPage())
            //console.log("current page: " + MessageStore.getters.getCurrentPage())
            if (MessageStore.getters.getCurrentRoomId() > 0 && 
                MessageStore.getters.getTotalPage() > 
                MessageStore.getters.getCurrentPage()) { 
                loadMoreMessage_Progress.value = true;
                loadMoreMessage();
                loadMoreMessage_Progress.value = false;
            }
        };
        
        return { handleIntersection }
    },
    data() {
        return {
            mdiMicrophone: mdiMicrophone,
            mdiEmoticon: mdiEmoticon,
            loaded: false,
            loading: false,
            search: '',
            messageTo: '',
            newAudio: null,
            menuOpen: false,
            EmojiVisible: false,
            'Frequently used': {
                emojiname: ''
            },
            loadMoreMessage_Progress,
            isLoaded: false,
        }
    },
    
    watch: {
        getChatContent() {
            this.stayBottom();
        },
    },
    computed: {
        getChatContent() {
            return MessageStore.getters.getChatContent();
        },
        getPartnerId() {
            return MessageStore.getters.getPartnerId();
        },
        getPartner() {
            return MessageStore.getters.getPartner();
        },
        getAudio() {
            const audio = new Audio(this.newAudio);
               //audio.play();
               return audio
        }        
    },
    methods: {
        openMicrophoneDialog() {
            this.menuOpen = !this.menuOpen;
        },
        onEmojiPicker() {
            this.EmojiVisible = !this.EmojiVisible
        },
        handleEmojiClick(emoji) {
            this.messageTo += emoji;
            var keys = Object.keys(json['Frequently used'])
            var items = Object.entries(json);
            var hozzaad = {
                'emoji': emoji
            }
            //Todo: Store the recently used emojis in store
            console.log(items[0][1]);
            items[0][1]["emoji"] = emoji
            for (var i = 0; i < items.length; i++) {
                for (let key in items[i]) {
                    items.keys += emoji
                }
            }
            this.EmojiVisible = false;

        },
        
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
        afterMessageSent(message, resp) {
            if (resp === 'Message sent') {
                MessageStore.commit('sendNewMessage', message); //TODO: Ezt az üzenetet a chatcontentbe beleteszi függetlenül attól hogy az adott content valóban a helyes szobába kerül-e. Ezt ellenőrizni kell, vagy a megfelelő szobába kell belehelyezni
                this.messageTo = '';
                this.stayBottom();
                this.updateChatRoomText(message);
            }
        },
        updateChatRoomText(message) {
            //Eventbus
            eventBus.emit('updateChatRoomContent', message)
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
        playSound() {
            console.log("zene")
        }
    },
    beforeUnmount() {
        eventBus.off('new-message', this.stayBottom());
    },
}

</script>

<style scoped>
.emoticon {
    cursor: pointer;
    right: 0;
    height: 17px;
}

.absolute {
    position: absolute;
}

.messaging_area {
    background-color: rgba(0, 128, 0, 0.133);
}

/*Here can be modified the chat rooms and contents height */
.scroll_msg_pane {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 30vh;
    max-height: 350px;
}

.chatCardFooter {
    bottom: 0; 
    background-color: #64B5F6;
    max-height: 600px; 
    width:100%;
    margin-left: 0px; 
    margin-top: 1px; 
}



.audioPopup {
    position: absolute;
    bottom: 100px;
    right: 0px;
    min-width: 100%;
    padding-left: 12px;
}

</style>