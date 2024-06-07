<template>
    <div v-if="isLoggedin()">
        <ChatCardWidget 
        v-if="getLoadingState"
        class=" overlayChatPanel "
        />
        <div class="chatHeadContainer" v-if="showChatHeads">
            <ChatHeads />
        </div>
        <div >
            <OnlineFriendsView />
        </div>
    </div>
</template>

<script>
import OnlineFriendsView from '@/components/ChatCard/OnlineFriendsView.vue';
import ChatCardWidget from './ChatCardWidget.vue';
import ChatHeads from './ChatHeads.vue';

import { isLoggedin } from '@/utils/auth'
import MessageStore from '@/stores/MessageStore';

export default {
    data() {
        return {
            isLoggedin,
        }
    },
    components: {
        OnlineFriendsView,
        ChatCardWidget,
        ChatHeads,
    },
    computed: {
        getLoadingState() {
            return MessageStore.getters.getLoadingState() || MessageStore.getters.getActiveChat();
        },
        showChatHeads() {
            if (MessageStore.getters.getChatHeads().length >= 1) {
            return true;
            }
            return false;
        }
    },
}
</script>

<style scoped>
.overlayChatPanel {
    position: fixed;
    bottom: 0;
    min-width: 300px;
    right: 350px;
    font-size: 13px;
    height: 400px;
}

.chatHeadContainer {
    position: fixed;
    bottom: 0;
    height: 300px;
    min-width: 40px;
    right: 300px;
    font-size: 13px;
    display: flex;
    flex-direction: column-reverse;
    overflow-y: auto;
    
}
</style>
