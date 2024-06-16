<template>
    <v-container>
        <v-row class="py-3">
                <h2>Messages</h2>
        <v-col cols="3">
            <div >
                <v-switch
                    v-model="this.drawer"
                    hide-details
                    inset
                    :label="`Nézet mód`"
                    class="text-right"
                ></v-switch>
            </div>
        </v-col>
        <v-col class="text-right">
            <new-message-dialog @sendToUser="this.createNewChatRoom"/>
        </v-col>
        </v-row>

        <v-col class="d-md-flex ">
            <Transition name="slide-fade">
                <v-col  v-if="this.drawer" > 

                    <div>
                        <!--TODO? https://vuetifyjs.com/en/components/timelines/#icon-dots-->
                        <v-row>
                            <v-text-field placeholder="Search..." 
                                v-model="searchText" 
                                single-line 
                                :loading=this.loading
                                prepend-inner-icon="mdi-magnify" 
                                rounded 
                                density="compact" 
                                variant="solo-filled"
                                @click:prepend-inner="filterMessage()"
                                v-on:keyup.enter="filterMessage()">
                            </v-text-field>
                        </v-row>
                        <!--Left messagerooms panel-->
                        <message-rooms-type1
                        :chatRooms="chatRooms"
                        @switchRoom="switchRoom"
                        ></message-rooms-type1>
                    </div>
                </v-col>
            </Transition>
            <!-- <Transition name="slide-in-fade">
                <v-col v-if="!this.drawer" cols="3">
                    <message-rooms-type2
                    :chatRooms="chatRooms[0]"
                    >
                    </message-rooms-type2>
                </v-col>
            </Transition> -->

            <!--right messagebox area-->
            <message-contents :content="chatContent"
                >
            </message-contents>
        </v-col>
    </v-container>    
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import fetchData from '@/stores/server_routes.js';
import { formatDate, getFullName } from '@/utils/common'
import UserStore from '@/stores/UserStore';
import eventBus from '@/stores/eventBus';

import { createNewChatRoom } from '@/utils/MessageHelper.js'

import NewMessageDialogComponent from '@/views/Message/MessagePage/NewMessageDialogComponent.vue';
import LeftMessageRoomsComponent from '@/views/Message/MessagePage/LeftMessageRoomsComponent.vue';
import LeftMessageRoomsComponentType2 from '@/views/Message/MessagePage/LeftMessageRoomsComponentType2.vue';
import RightMessageContentsComponent from '@/views/Message/MessagePage/RightMessageContentsComponent.vue';

let chatRooms = ref();
let chatContent = ref();

export default {
    setup() {
        onMounted(async () => {
            try {
                var resp = await fetchData.methods
                    .fetchData('GET', 'GetAllChatRoom', null, UserStore.getters.getUserId());

                chatRooms.value = resp;            
                chatContent.value = resp[0]; //első szoba lesz az alapértelmezett
                console.log("response: " + JSON.stringify(chatContent.value))
            }
            catch (error) {
                console.log(error);
            }
        });
    },
    mounted() {
        eventBus.on('new-message', this.messageSendCallback);
    },    
    components: {
        'new-message-dialog': NewMessageDialogComponent,
        'message-rooms-type1': LeftMessageRoomsComponent,
        'message-rooms-type2': LeftMessageRoomsComponentType2,
        'message-contents': RightMessageContentsComponent,
    },
    data() {
        return {
            loading: false,
            searchText: '',
            chatRooms,
            chatContent,
            formatDate, getFullName,
            drawer: true,
            createNewChatRoom,
            showNewMsg: false,
        }
    },
    methods: {
        async filterMessage() {
            this.loading = true;
            var resp = await fetchData.methods
                .fetchData('GET', 'GetAllChatRoom', null, UserStore.state.userId, this.searchText);
            chatRooms.value = null;
            chatRooms.value = resp;
                
            console.log(resp)
            this.loading = false;
        },
        switchRoom(index) {
            chatContent.value = chatRooms.value[index];
        },
        
        messageSendCallback(message) {
            //console.log("current user/me: " + UserStore.getters.getUserId());
            //console.log("message to add chatContents: " + JSON.stringify(message));
            //console.log("chatRooms : " + JSON.stringify(chatRooms.value[0].key));
            for (const [key, value] of Object.entries(chatRooms.value)) {
                if (value.value.userId === message.senderId  || 
                value.value.userId == message.receiverId || 
                value.value.userId == message.authorId) {
                    //console.log("adding message to room: " + key)
                    this.insertMessage(key, message);
                }
            }
        },
        insertMessage(index, message) {
            chatRooms.value[index].key.chatContents.unshift(message)
        },

    },
    
    beforeUnmount() {
        eventBus.off('new-message', this.messageSendCallback);
    },
}

</script>

<style >
.profile_pic_container {
    padding-right: 0;
}

.profile_pic {
    border-radius: 50%;
    border: 1px solid rgba(7, 7, 7, 0.285);
    background-color: rgb(137, 164, 197);
    width: 30px;
}

.message_time {
    text-align: right;
    padding-top: 0;
    padding-right: 0;
}

.audioPopup {
    position: absolute;
    bottom: 15%;
    right: 0px;
    min-width: 100%;
    padding-left: 12px;
}

.overflowing-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 5px;
}

.slide-fade-enter-from, 
.slide-fade-leave-to {
  transform: translateX(-150px);
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

/* message avatar slide in*/
.slide-in-fade-enter-from,
.slide-in-fade-leave-to {

  transform: translateX(200px);
  opacity: 0;
}

.slide-in-fade-enter-active {
  transition: all 0.6s ease-in;
  opacity: 0;
}

.slide-in-fade-leave-active {

  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-in-fade-leave-active .inner {
  transition-delay: 4s;
}
</style>