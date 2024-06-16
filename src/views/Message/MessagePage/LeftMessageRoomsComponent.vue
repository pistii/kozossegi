<template>
    <v-card class="bg-transparent">
        <div class="scroll_msg_pane scrollbar py-3"
        >
            <div v-if="chatRooms != null"
                v-for="(room, index) in chatRooms">
                <v-row v-if="room.key.chatContents && 
                    room.key.chatContents.length > 0"
                    :class="room.key.chatContents[0].status === 1
                    ? 'bg-blue-darken-3 py-5' : 'pb-5'" >
                    <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                            <v-card 
                            class="px-6 elevation-3" 
                            variant="tonal"
                            :color="isHovering ? 'primary' : undefined" 
                            v-bind="props" 
                            width="100%"
                            @click="switchRoom(index)"
                            >
                            <v-sheet class="elevation-3 bg-transparent">
                                <v-col class="profile_pic_container">
                                    <div>
                                        <v-avatar>
                                        <v-img class="profile_pic"
                                            :src="getUserAvatar(room.value.avatar)" />
                                        </v-avatar>
                                        {{ getFullName(room.value.firstName, room.value.middleName, room.value.lastName) }}
                                    </div>
                                </v-col>
                                <v-col>
                                    <v-row class=" pa-3">
                                        <span v-if="room.key.chatContents.length>0"  class="text-container">
                                            <span >
                                                {{ formatText(room.key.chatContents[0]) }}
                                            </span>
                                        </span>
                                        <span v-else></span>
                                    </v-row>
                                </v-col>
                            </v-sheet>
                                <v-col class="message_time pa-2">
                                    {{ formatDate(room.key.endedDateTime) }}
                                </v-col>
                            </v-card>
                            <v-divider></v-divider>
                        </template>
                    </v-hover>
                </v-row>
            </div>
        </div>
    </v-card>
</template>

<script>
import { getFullName, formatDate, getUserAvatar } from '@/utils/common';
import { showMessage } from './showMessage';
import eventBus from '@/stores/eventBus';
import MessageStore from '@/stores/MessageStore';

export default {
    props: {
        chatRooms: Object,
    },
    
    mounted() {
        eventBus.on('updateChatRoomContent', this.updateContext);
        
    },

    data() {
        return {
            getFullName,
            formatDate,
            getUserAvatar,

            showMessage,
            formatText,
        }
    },
    watch: {
        formatDate() {
            formatDate
        },
    },
    methods: {
        updateContext(messageContext) {
            for (const [key, value] of Object.entries(this.chatRooms)) 
            {
                if (value.key.chatRoomId === MessageStore.getters.getCurrentRoomId()) {
                    value.key.chatContents[0].message = formatText(messageContext.message)
                    var sentDateTime = new Date(); 
                    if (shouldUpdateTime(sentDateTime, value.key.endedDateTime)) {
                        
                        value.key.endedDateTime = sentDateTime;
                    }
                }
            }
            console.log(messageContext);
        },

        truncateText() { //Chat szoba túlnyúló tartalmának tördeléséhez
            const container = this.$refs.textContainer;
            if (container) {
                const maxWidth = container.clientWidth;
                const text = this.originalText;

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                context.font = window.getComputedStyle(container).font;

                let truncatedText = "";
                let width = 0;

                for (let i = 0; i < text.length; i++) {
                const charWidth = context.measureText(text[i]).width;
                if (width + charWidth <= maxWidth) {
                    truncatedText += text[i];
                    width += charWidth;
                } else {
                    truncatedText += "...";
                    break;
                }
                }

                this.truncatedText = truncatedText;
            }
        },
        switchRoom(index) {
            //MessageStore.dispatch("addUser", this.chatRooms[index].value);
            this.$emit('switchRoom', index);
            var userId = this.chatRooms[index].value.userId;
            eventBus.emit('userId-to-sendMsg-msgView', userId);
        }
    },
    
    beforeDestroy() {
        eventBus.off('updateChatRoomContent');
    },
}

function formatText(chatObj) {
    const n = 30;
    if (chatObj)
        if (chatObj.chatFile) return "Üzenet csatolmánnyal.";
        else return (chatObj.message.length > n) ? chatObj.message.slice(0, n-1) + '&#8230;' : chatObj.message;
    else return 'Üzenet csatolmánnyal.'
}

function shouldUpdateTime(newDateTime, currentDateTime) {
    if (!(currentDateTime instanceof Date)) {
        currentDateTime = new Date(currentDateTime);
    }

    if (newDateTime.getTime() !== currentDateTime.getTime()) {
        // Egyéb feltételek hozzáadhatók, például csak ha az új idő frissebb
        return true;
    }
    return false;
}

</script>


<style scoped>
.text-container {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/*Here can be modified the chat rooms and contents height */
.scroll_msg_pane {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 100vh;
}


</style>