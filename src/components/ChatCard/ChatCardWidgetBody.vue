<template>
    <v-col>
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
            class="messaging_area scrollbar scroll_msg_pane containerSize mb-3"
            v-if="chatContents" ref="parent">
                <Observer @intersect="handleIntersection" 
                    :options="{ threshold: 0 }" />
                <span v-for="(message, index) in chatContents" :key="index">
                    <chat-msg-comp  :msg="message" />
                </span>
            </v-sheet>
            <v-container class="containerSize" v-else>
                <p>Még nincs megjelenítendő beszélgetés...</p>
            </v-container>
    </v-col>
</template>

<script>
import MessageStore from '@/stores/MessageStore';
import UserStore from '@/stores/UserStore';

import ChatMessageComponent from '@/views/Message/MessagePage/ChatMessageComponent.vue'
import Observer from '@/components/Observer.vue'
import { ref, nextTick, onMounted } from 'vue';
import eventBus from '@/stores/eventBus';

import fetchData from '@/stores/server_routes';

const loadMoreMessage_Progress = ref(false);
let chatContents = ref([]);

export default {
    props: {
        containerHeight: Number,
    },  
    components: {
        'chat-msg-comp' : ChatMessageComponent,
        Observer,
    },
    mounted() {
        eventBus.on('new-message', this.stayBottom);
    },
    setup() {
        onMounted(async () => {
            try {
                chatContents.value = null;
                var resp = await fetchData.methods
                    .fetchData('GET', 'GetAllChatRoom', null, UserStore.state.userId);
                var selectedChatRoom = 
                resp.find(item => item.value.userId === MessageStore.getters.getPartnerId());

                chatContents.value = selectedChatRoom.key.chatContents;
            }
            catch (error) {
                switch (error) {
                    case 'TypeError': {chatContents.value = []; console.log("Helo") }
                }
                console.log(error);
            }
        })

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
            messageTo: '',
            newAudio: null,
            loadMoreMessage_Progress,

            chatContents,
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
    },
    methods: {
        
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

.messaging_area {
    background-color: rgba(0, 128, 0, 0.133);
}

/*Here can be modified the chat rooms and contents height */
.scroll_msg_pane {
    overflow-y: auto;
    overflow-x: hidden;
}

.containerSize {
    height: 300px;
    max-height: 350px;
    max-height: 30vh;
}

.chatCardFooter {
    background-color: #64B5F6;
    width:100%;
    margin-left: 0px; 
    margin-top: 1px; 
}




</style>