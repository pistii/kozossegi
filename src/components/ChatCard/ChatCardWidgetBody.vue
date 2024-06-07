<template>
    <v-col>
        <div v-if="isDataLoading"
            class="overlayLoading">
            <v-progress-circular
                :width="3"
                color="blue"
                indeterminate
                v-show="isDataLoading" 
            >
            </v-progress-circular>
        </div>
        <v-sheet 
        class="messaging_area  scrollbar scroll_msg_pane containerSize" id="container"
         ref="parent">
            <div>
            <Observer @intersect="handleIntersection" 
            :options="{ threshold: 0.3 }" />

            <v-container class="containerSize" v-if="noDataFound">
                <p>Még nincs megjelenítendő beszélgetés...</p>
            </v-container>
            <div v-else>
                <span
                    v-for="(message, index) in fetchMessages?.chat?.data" 
                    :key="index">
                    <chat-msg-comp :msg="message" />
                </span>
            </div>
        </div>
        </v-sheet>            
    </v-col>
</template>

<script>
import MessageStore from '@/stores/MessageStore';
import { ref, nextTick } from 'vue';
import eventBus from '@/stores/eventBus';

import ChatMessageComponent from '@/views/Message/MessagePage/ChatMessageComponent.vue'
import Observer from '@/components/Observer.vue'


const chatContents = ref([]);
const enableObserver = ref(false);

export default {
    components: {
        'chat-msg-comp' : ChatMessageComponent,
        Observer,
    },
    mounted() {
        eventBus.on('update-scrollHeight', this.stayBottom);
   },
   
   setup() {
        const parent = ref(null);

        const loadMoreMessage = async () => {
            await MessageStore.dispatch('loadMoreMessage', chatContents.value.chat);
        }
        const base64ToImage = (data) => {
            var imageTypes = ["image/png", "image/jpeg", "image/gif", "image/bmp"];
            if (data === undefined) return;

            var dataObj = Object.entries(data);
            for (const iterator of dataObj[2]) {
                //console.log(iterator)
                for (const chatContents of iterator) {
                    if (chatContents.chatFile !== null && chatContents.chatFile !== undefined) {
                        //console.log(chatContents.chatFile);
                        if (imageTypes.includes(chatContents.chatFile.fileType)) {
                            var binaryData = [];
                            binaryData.push(chatContents.chatFile.fileData);
                            var blobObj = new Blob([binaryData], {type: chatContents.chatFile.fileType});
                            var url = URL.createObjectURL(blobObj);
                            chatContents.chatFile.fileData = url;
                            console.log(chatContents.chatFile.fileData);
                        }
                    }
                }
            }
        };
        const handleIntersection = () => {
            if (chatContents.value !== undefined) {
                var totalPages = chatContents?.value.chat?.totalPages;
                var cp = chatContents?.value.chat?.currentPage;
                if (totalPages >= cp) {
                    if (chatContents.value.chat.data.length !== 0) {
                        setTimeout(() => {
                            MessageStore.commit('showLoader', true);
                            loadMoreMessage().then(() => {
                                MessageStore.commit('showLoader', false);  
                                scrollBack();
                        
                            });
                        }, 100);
                    }
                }
            }
        };

        const scrollBack = () => {
            if (parent.value.$el) {
                //scrollTop
                parent.value.$el.scrollTop = parent.value.$el.scrollTop + 400; 
            }
        };

        return { 
            handleIntersection, 
            parent, 
            base64ToImage,
        }
   },
   watch: {
        getChatContents: {
            deep: true,
            handler () {
                //this.updateContent();
                this.stayBottom();
            }
        },
   },
   computed: {
        getChatContents() {
            return MessageStore.getters.getActiveChat();
        },
        showObserver() {
            return enableObserver;
        },
        isDataLoading() {
            return MessageStore.getters.getLoadingState();
        },
        fetchMessages() {
            chatContents.value = MessageStore.getters.getActiveChat();
            return MessageStore.getters.getActiveChat();
        },
        noDataFound() {
            return !MessageStore.getters.getActiveChat()?.chat?.data && !MessageStore.getters.getLoadingState();
        }
    },
    data() {
        return {
           loadMoreMessage_Progress : false,

            chatContents,
            enableObserver,
        }
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

        updateContent() {
            this.stayBottom();
        },
        
    },
    beforeUnmount() {
        eventBus.off('update-scrollHeight', this.scrollToBottom());

    },
}

</script>

<style scoped>
.messaging_area {
    background-color: rgba(0, 128, 0, 0.133);
}

.scroll_msg_pane {
    overflow-y: auto;
    overflow-x: hidden;
}

.containerSize {
    height: 300px;
    max-height: 350px;
    max-height: 30vh;
}

.overlayLoading {
    position: absolute;
    padding: 45%;
    padding-top: 5%;
    width: 300px;
}

</style>