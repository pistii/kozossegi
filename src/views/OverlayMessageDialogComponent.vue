<template>
    <div :style="{ height: containerHeight + 'px' }" class="overlayContainer" v-if="!closed">
        <div class="sidebar" >
            <!--HEADER-->
            <div class="text-end bg-blue-darken-2 panelNavHeader" id="position">

                <span class="nameTabContainer bg-blue-lighten-2 onHover"
                v-for="person in getOpenedChatRooms"
                @click="switchMessageTab(person.id)" >
                    <span class="nameTab">
                        {{ getFullName(person.firstName, person.middleName, person.lastName) }}
                    </span>
                    <b>
                        <v-icon 
                        class="nameTabCloseBtn" 
                        size="20"
                        @click="closeMsgTab(person.id)"
                        > 
                            mdi-close-outline
                        </v-icon>
                    </b>
                </span>
                <!--main tab-->
                <v-btn class="navBtn" @click="minimalizeWindow()" variant="plain" size="x-small">
                    <v-icon v-if="!minimalized">
                        mdi-minus
                    </v-icon>
                    <v-icon v-else >
                        mdi-square-outline
                    </v-icon>
                </v-btn>
                <v-btn class="pr-0 px-auto" @click="WindowHandler(true)" variant="plain" size="x-small">
                    <v-icon>
                        mdi-close-circle
                    </v-icon>
                </v-btn>
            </div>
        </div>
        <div class="dragbar" id="dragBar" @mousedown="startDrag">
        </div>
        <div 
        class="main" 
        :style="{ top: containerHeight + 'px' }"
        >
            <v-row >
                <v-col cols="3" class="bg-blue-darken-2">
                    <LeftMessageRoomsComponent :chatRooms="chatRooms[0]"/>
                </v-col>

                <v-col cols="9" class="bg-green right-msg">
                    <RightMessageContentsComponent />
                    <!-- {{ person }} -->
                    
                </v-col>

            </v-row>
        </div>

    </div>
</template>

<script>
import { getFullName, getUserAvatar } from '@/utils/common';
import { setStartingChatRoom } from './Message/MessagePage/showMessage';
import fetchData from '@/stores/server_routes.js';
import MessageStore from '@/stores/MessageStore';
import UserStore from '@/stores/UserStore';
import eventBus from '../stores/eventBus';

import LeftMessageRoomsComponent from '@/views/Message/MessagePage/LeftMessageRoomsComponentType2.vue';
import RightMessageContentsComponent from '@/views/Message/MessagePage/RightMessageContentsComponent.vue';
import NewMessageDialogComponent from '@/views/Message/MessagePage/NewMessageDialogComponent.vue';

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
            dragging: false,
            minimalized: false,
            closed: false,
            DEFAULT_CONTAINER_HEIGHT: 200,
            containerHeight: this.DEFAULT_CONTAINER_HEIGHT, // Kezdeti érték
        }
    },
    components: {
        LeftMessageRoomsComponent,
        RightMessageContentsComponent,
        NewMessageDialogComponent,

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
        switchMessageTab(id) {
            showMessage(key[1].key.chatRoomId, key[1].value)
        },
        async sendMsg() {
            this.messageTxt = ''
            console.log(this.messageTxt + " msg was sent...")
        },
        closeMsgTab(personId) {
            MessageStore.dispatch('removeOpenedChatRoom', { personId: personId });
        },

        startDrag(event) {
            event.preventDefault();
            this.dragging = true;
            document.addEventListener('mousemove', this.drag);
            document.addEventListener('mouseup', this.endDrag);
        },
        drag(event) {
            if (this.dragging) {
                let container_padding_and_height = 70;
                this.containerHeight = window.outerHeight - event.pageY-container_padding_and_height;             
            }
        },
        endDrag() {
            this.dragging = false;
            document.removeEventListener('mousemove', this.drag);
            document.removeEventListener('mouseup', this.endDrag);
        },
        minimalizeWindow() {
            if (this.minimalized) {
                this.containerHeight = this.DEFAULT_CONTAINER_HEIGHT;
                this.minimalized = false;
            }
            else {
                this.containerHeight = 50;
                this.minimalized = true;
            }
        },
        WindowHandler(shouldClose) {
            console.log(shouldClose)
            if (shouldClose) {
                this.closed = true;
            }
            else if (this.closed = true) {
                this.closed = false;
            }
            
        }
    },
    beforeUnmount() {
        eventBus.off('invoke-message-dialog-panel', this.closed);
    },

}
</script>

<style>


.overlayContainer {
    padding-left: 5px;
    background-color: black;
    position: absolute;
    border: 1px solid black;
    border-left: 5px solid rgb(43, 43, 43);
    z-index: 10000;
}

.panelNavHeader {
    border-radius: 30px;
    max-height: 25px;
}

.nameTabContainer {
    border: 1px solid grey;
    padding-inline: 20px;
    margin-inline: 7px;
    border-radius: 10px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 4px;
    padding-right: 15px;
}

.nameTabCloseBtn {
    padding-left: 15px; 
    margin-top: -5px; 
    margin-right: -7px;
    color: rgba(12, 12, 75, 0.801);
}

.nameTab {
    transform: skewX(30deg);
    font-family: Verdana;
}

.sidebar {
    background-color: rgb(77, 77, 77); 
    margin-top: 10px;
    width: 100%;
    float: left;
    /* position: absolute; */
    height: 100px; /* if size modified, modify the variable also*/
    overflow-y: hidden;
}

.dragbar {
    width: 100%;
    height: 5px;
    cursor: row-resize;
    background-color: darkgray;
}

.main {
    background-color: rgba(36, 36, 36, 0.253);
    float: left;
    /* position: absolute; */
    height: 100px;
    right: 0;
    width: 100%;
    left: 200px;
    margin-top: 10px;
    display: flex;
    padding-inline: 15px;
}

#main {
    background-color: BurlyWood;
    float: left;
    /* position: absolute; */
    height: 100px;
    right: 0;
    width: 100%;
    left: 200px;
    margin-top: 10px;
}

#dragbar {
    background-color: black;
    height: 5px;
    float: left;
    width: 100%;
    cursor: row-resize;
}

#ghostbar {
    width: 3px;
    background-color: #000;
    opacity: 0.5;
    position: absolute;
    cursor: col-resize;
    z-index: 999
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