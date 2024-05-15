<template>
    <div :style="{ height: containerHeight + 'px' }" 
    class="overlayContainer" 
    v-if="!closed">
    
        <ChatCardWidgetHeader @setChatContainerHeight="setChatContainerHeight"/>
        <v-row >
            <ChatCardWidgetBody style="max-width: 324px;" />
        </v-row>  
    </div>
</template>

<script>
import { getFullName, getUserAvatar } from '@/utils/common';
import { setStartingChatRoom } from '@/views/Message/MessagePage/showMessage';
import fetchData from '@/stores/server_routes.js';
import MessageStore from '@/stores/MessageStore';
import UserStore from '@/stores/UserStore';
import eventBus from '@/stores/eventBus';

import ChatCardWidgetHeader from '@/components/ChatCardWidgetHeader.vue';
import ChatCardWidgetBody from '@/components/ChatCardWidgetBody.vue';

import { onMounted } from 'vue';
import { ref } from 'vue';

var chatRooms = ref([]);
export default {
    data() {
        return {
            getFullName, getUserAvatar,
            messageTxt: '',
            tabVisible: true,
            getFullName,
            chatRooms,
            containerHeight : undefined,

        }
    },
    components: {
        ChatCardWidgetHeader,
        ChatCardWidgetBody,
    },
    computed: {
        getOpenedChatRooms() {
            return MessageStore.getters.getOpenedChatRooms();
        }
    },
    mounted() {
        eventBus.on('invoke-message-dialog-panel', this.WindowHandler);
    },
    setup() {
        onMounted(async () => {
            try {
                var resp = await fetchData.methods
                    .fetchData('GET', 'GetAllChatRoom', null, UserStore.state.userId);
                setStartingChatRoom(resp[0]); //Az első szoba amelyik utoljára aktív volt
                
                chatRooms.value.push(resp);
                console.log(resp)
            }
            catch (error) {
                console.log(error);
            }
        })
    },
    methods: {
        async AsyncShowMessage(roomId, p) {
            var data = await showMessage(roomId, p).then(resp => console.log(resp));
        },
        async sendMsg() {
            this.messageTxt = ''
            console.log(this.messageTxt + " msg was sent...")
        },
        closeMsgTab(personId) {
            MessageStore.dispatch('removeOpenedChatRoom', { personId: personId });
        },

        setChatContainerHeight(size) {
            console.log("konténer méret beállítva: " + size)
            this.containerHeight = size;
        }

    },
    beforeUnmount() {
        eventBus.off('invoke-message-dialog-panel', this.closed);
    },

}
</script>

<style>


.overlayContainer {
    bottom: 0;
    z-index: 10000;
}

.panelNavHeader {
    border-radius: 30px;
    max-height: 25px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
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