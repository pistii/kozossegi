<template>
    
    <div class="bg-transparent"  v-if="isLoggedin()">
            <OverlayMessageDialogComponent v-if="getOpenedChatRooms.length>0"
            class=" overlayChatPanel "
            />
            <div >
                <OnlineFriendsView v-if="isLoggedin()"  />
            </div>
        </div>
</template>

<script>
import OnlineFriendsView from '@/views/OnlineFriendsView.vue';
import OverlayMessageDialogComponent from '@/views/OverlayMessageDialogComponent.vue'
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
        OverlayMessageDialogComponent
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
