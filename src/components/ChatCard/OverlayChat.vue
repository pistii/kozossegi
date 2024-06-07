<template>
    <div v-if="isLoggedin()">
        <ChatCardWidget v-if="getOpenedChatRooms.length>0"
        class=" overlayChatPanel "
        />
        <div >
            <OnlineFriendsView />
        </div>
    </div>
</template>

<script>
import OnlineFriendsView from '@/views/OnlineFriendsView.vue';
import ChatCardWidget from './ChatCardWidget.vue'
import { isLoggedin } from '@/utils/auth'
import { createNewChatRoom } from '@/utils/MessageHelper.js'
import MessageStore from '@/stores/MessageStore';


export default {
    data() {
        return {
            createNewChatRoom,
            isLoggedin
        }
    },
    components: {
        OnlineFriendsView,
        ChatCardWidget
    },
    computed: {
        getOpenedChatRooms() {
            return MessageStore.getters.getOpenedChatRooms();
        }
    },
    methods: {
        async sendMessage(user) {
            var createdChatRoom = await createNewChatRoom(user)
            MessageStore.commit('setOpenedChatRooms', createdChatRoom);
        }
    }
}
</script>

<style>
.overlayChatPanel {
    position: fixed;
    bottom: 0;
    min-width: 300px;
    right: 350px;
    font-size: 13px;
}

.chatHeadContainer {
    position: fixed;
    background-color: green;
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
