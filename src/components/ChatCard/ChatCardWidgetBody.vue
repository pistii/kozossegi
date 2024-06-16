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
            <div class="pt-1">
            <Observer 
            v-if="!isDataLoading && fetchMessages"
            @intersect="handleIntersection" 
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
var prevScrollHeight = ref(null);

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
            await MessageStore.dispatch('loadMoreMessage');
        }
        const handleIntersection = () => {
            console.log("intersecting");
            prevScrollHeight.value = parent.value.$el.scrollTop;
                            loadMoreMessage().then(() => {
                                scrollBack();
                            });
        };

        const scrollBack = () => {
            if (parent.value.$el)
                parent.value.$el.scrollTop = prevScrollHeight.value; 
            
        };

        return { 
            handleIntersection, 
            parent, 
            enableObserver,
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
    },
    beforeUnmount() {
        eventBus.off('update-scrollHeight', this.scrollToBottom());
    }
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