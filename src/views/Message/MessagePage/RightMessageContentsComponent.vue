<template>
    <v-col style="position: relative; min-height: 50vw;" >
        <v-container class="text-center" v-show="getPartner.firstName != undefined">
            <v-sheet style="background-color: #4489ff44;" rounded> <!--todo: show if online here-->
                <RouterLink  :to="{ path:'/profile='+ getPartner.userId }">
                    <v-avatar>
                        <v-img class="profile_pic"
                            :src="getPartner.avatar ?? '/src/assets/imgs/blank_profile_pic.png'" ></v-img>
                    </v-avatar>
                    <p>
                    {{ getFullName(getPartner.firstName, getPartner.middleName, getPartner.lastName) }}
                    </p>
                </RouterLink>
            </v-sheet>
                
        </v-container>

        <v-container class=" absolute">
            <v-progress-circular
                :width="3"
                color="blue"
                indeterminate
                v-show="loadMoreMessage_Progress"
            >
            </v-progress-circular>
        </v-container>

        <v-container class="messaging_area scrollbar scroll_msg_pane pb-8 "  v-if="getChatContent.length>=0"   ref="parent">
            <Observer @intersect="handleIntersection" 
                :options="{ threshold: 0 }" />
            <span v-for="(message, index) in getChatContent" :key="index">
                <chat-msg-comp  :msg="message" />
            </span>
        </v-container>
        <v-container v-else><p>Még nincs megjelenítendő beszélgetés...</p></v-container>
        
        <v-row style="max-height: 600px;">
            <EmojiPicker v-if="EmojiVisible" @emoji_click="handleEmojiClick" />
            <v-icon @click="onEmojiPicker">mdi-emoticon</v-icon>
            
            <div class="messageBox">
                <AudioRecorder v-if="menuOpen" class="audioPopup"></AudioRecorder>
                
                <v-text-field class=" pt-2" placeholder="Type here your message..."
                    append-inner-icon="mdi-send-circle" v-model="messageTo" @click:append-inner="onSendMessage"
                    v-on:keyup.enter="onSendMessage()">
                    <v-icon class="onHover"  @click="openMicrophoneDialog">mdi-microphone
                    </v-icon>
                </v-text-field>
            </div>
        </v-row>
    </v-col>
</template>

<script>
import MessageStore from '@/stores/MessageStore';
import UserStore from '@/stores/UserStore';

import { mdiMicrophone, mdiEmoticon } from '@mdi/js'
import json from '@/emojis-data.json'
import EmojiPicker from './EmojiPicker.vue'
import ChatMessageComponent from './ChatMessageComponent.vue'
import AudioRecorder from './audioRecorder.vue'
import audioPlayer from './audioPlayer.vue'
import Observer from '@/components/Observer.vue'
import { ref, nextTick, onMounted } from 'vue';
import eventBus from '@/stores/eventBus';

import { getFullName } from '@/utils/common';
import fetchData from '@/stores/server_routes';

//import EmojiPicker from '@/zaichaopan/emoji-picker';

const loadMoreMessage_Progress = ref(false);

export default {
    components: {
        EmojiPicker,
        AudioRecorder,
        audioPlayer,
        'chat-msg-comp' : ChatMessageComponent,
        Observer,

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
            getFullName,
            mdiMicrophone: mdiMicrophone,
            mdiEmoticon: mdiEmoticon,
            loaded: false,
            loading: false,
            search: '',
            messageTo: '',
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


.messageBox {
    position: relative;
    bottom: 0px;
    right: 0px;
    min-width: 100%;
    padding-left: 12px;
    display: inline-block;
    flex-direction: column;

}

</style>