<template>
    <v-col>
        <div v-if="loadMoreMessage_Progress"
            class="overlayLoading">
            <v-progress-circular
                :width="3"
                color="blue"
                indeterminate
                v-show="loadMoreMessage_Progress" 
            >
            </v-progress-circular>
        </div>

        <v-sheet 
        class="messaging_area  scrollbar scroll_msg_pane containerSize" id="container"
        v-if="this.chatContents" ref="parent">
                <Observer v-if="showObserver" @intersect="handleIntersection" 
                :options="{ threshold: 0.3 }" />
            <span v-for="(message, index) in this.chatContents.data" :key="index">
                <chat-msg-comp  :msg="message" />
            </span>
        </v-sheet> 
        <v-container class="containerSize" v-else>
            <p v-if="!loadMoreMessage_Progress">Még nincs megjelenítendő beszélgetés...</p>
        </v-container>
           
    </v-col>
</template>

<script>
import MessageStore from '@/stores/MessageStore';
import { ref, nextTick, onMounted } from 'vue';
import eventBus from '@/stores/eventBus';

import ChatMessageComponent from '@/views/Message/MessagePage/ChatMessageComponent.vue'
import Observer from '@/components/Observer.vue'


const loadMoreMessage_Progress = ref(false);
const chatContents = ref([]);
const enableObserver = ref(false);

export default {
    components: {
        'chat-msg-comp' : ChatMessageComponent,
        Observer,
    },
    mounted() {
        eventBus.on('update-scrollHeight', this.stayBottom);
        this.fetchMessages();
   },
   
   setup() {
        const parent = ref(null);
        var currentPage = ref(1);
        var totalPages = ref(null);

        const loadMoreMessage = async () => {
            var response = await MessageStore.dispatch('loadMoreMessage');
            totalPages.value = response.totalPages;
            currentPage.value = response.currentPage;
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
                    // switch (chatContents.chatFile.fileType) {
                    //     case 'image/wav':
                    //         console.log("file is audio!")
                    //         break;
                    //     case imageTypes.includes(chatContents.chatFile.fileType):
                    //         console.log("file is image!");                        
                    //         break;
                    //     default:
                    //         break;
                    //     }
                    // }
                }
            }
        };
        const handleIntersection = () => {
            if (totalPages.value > currentPage.value) {
                if (chatContents.value.length !== 0) {
                    setTimeout(() => {
                        loadMoreMessage_Progress.value = true;
                        loadMoreMessage().then(() => {
                            scrollBack();
                            loadMoreMessage_Progress.value = false;

                        });
                    }, 100);
                }
            }
        };

        const scrollBack = () => {
            if (parent.value.$el) {
                //scrollTop
                parent.value.$el.scrollTop = parent.value.$el.scrollTop + 1350; 
            }
        };

        return { 
            handleIntersection, 
            parent, 
            base64ToImage,
        }
   },
   watch: {
        userPartnerId() {
            this.fetchMessages();
        },
        getChatContents: {
            deep: true,
            handler () {
                this.updateContent();
            }
        }
   },
   computed: {
        getChatContents() {
            return MessageStore.getters.getActiveChat();
        },
        showObserver() {
            return enableObserver;
        }
    },
    data() {
        return {
           loadMoreMessage_Progress,

            chatContents,
            enableObserver,
        }
    },
    
    methods: {

        async fetchMessages() {
            this.loadMoreMessage_Progress = true;
            if (MessageStore.getters.getPartner() !== null) {
                var response = await MessageStore.dispatch('fetchMessages');
                this.chatContents = response;

                this.loadMoreMessage_Progress = false;
                if (chatContents.value) {
                    chatContents.value.data.reverse();
                }
                this.stayBottom();
                this.totalPages = chatContents.value.totalPages;
                
                enableObserver.value = true;
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

.overlayLoading {
    position: absolute;
    padding: 45%;
    padding-top: 5%;
    width: 300px;
}

</style>