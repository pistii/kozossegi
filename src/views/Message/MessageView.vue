<template>
    <v-container>
        <v-row class="py-3">
                <h2>Messages</h2>
        <v-col cols="3">
            <div>
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
            <new-message-dialog  @sendToUser="this.createNewChatRoom"/>
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
                        :chatRooms="chatRooms[0]"
                        ></message-rooms-type1>
                    </div>
                </v-col>
            </Transition>
            <Transition name="slide-in-fade">
                <v-col v-if="!this.drawer" cols="3">
                    <message-rooms-type2
                    :chatRooms="chatRooms[0]"
                    >
                    </message-rooms-type2>
                </v-col>
            </Transition>

            <!--right messagebox area-->
            <message-contents 
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
import MessageStore from '@/stores/MessageStore';

import { createNewChatRoom, doesRoomExist } from '@/utils/MessageHelper.js'

import { setStartingChatRoom } from './MessagePage/showMessage'
import NewMessageDialogComponent from '@/views/Message/MessagePage/NewMessageDialogComponent.vue';
import LeftMessageRoomsComponent from '@/views/Message/MessagePage/LeftMessageRoomsComponent.vue';
import LeftMessageRoomsComponentType2 from '@/views/Message/MessagePage/LeftMessageRoomsComponentType2.vue';
import RightMessageContentsComponent from '@/views/Message/MessagePage/RightMessageContentsComponent.vue';

let chatRooms = ref([]);
let chatContent = ref([]);
var partnerId = MessageStore.getters.getPartnerId();



export default {
    setup() {
        onMounted(async () => {
            try {
                var resp = await fetchData.methods
                    .fetchData('GET', 'GetAllChatRoom', null, UserStore.state.userId);
                setStartingChatRoom(resp[0]); //Az első szoba amelyik utoljára aktív volt
                chatRooms.value.push(resp);
            }
            catch (error) {
                console.log(error);
            }
        })
    },
    
    components: {
        'new-message-dialog': NewMessageDialogComponent,
        'message-rooms-type1': LeftMessageRoomsComponent,
        'message-rooms-type2': LeftMessageRoomsComponentType2,
        'message-contents': RightMessageContentsComponent,
    },
    data() {
        return {
             loaded: false,
             loading: false,
            searchText: '',
            chatRooms,
            chatContent,
            partnerId,
            partner: [],
            formatDate, getFullName,
            drawer: true,
            createNewChatRoom, doesRoomExist
        }
    },
    methods: {
        async filterMessage() {
            this.loading = true;
            var resp = await fetchData.methods
                .fetchData('GET', 'GetAllChatRoom', null, UserStore.state.userId, this.searchText);
            chatRooms.value = [];
            chatRooms.value.push(resp);
                
            console.log(resp)
            this.loading = false;
        },
    }
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

.messaging_area {
    scroll-snap-type: y proximity;
    overflow-y: scroll;
    flex-direction: column;
    height: 80vh;
    display: flex;
}

/*Here can be modified the chat rooms and contents height */
.scroll_msg_pane {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 60vh;
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

/*
Chrome, Edge, Safari and Opera support the non-standard ::-webkit-scrollbar pseudo element
*/

.scrollbar::-webkit-scrollbar {
    width: 12px;
}

.scrollbar::-webkit-scrollbar-track {
    background-color: rgba(172, 170, 173, 0.517);
    border-radius: 5px;
}

.scrollbar::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgb(10, 151, 239);
    border-radius: 3px;
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