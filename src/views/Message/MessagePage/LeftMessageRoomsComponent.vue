<template>
    <v-card class="bg-transparent">
        <div class="scroll_msg_pane scrollbar py-3"
        >
            <div v-if="chatRooms != null"
                v-for="(room, index) in Object.entries(chatRooms)">
                <v-row v-if="room[1].key.chatContents && 
                    room[1].key.chatContents.length > 0"
                    :class="room[1].key.chatContents[0].status === 1
                    ? 'bg-blue-darken-3 py-5' : 'pb-5'" >
                    <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                            <v-card 
                            class="px-6 elevation-3" 
                            variant="tonal"
                            :color="isHovering ? 'primary' : undefined" 
                            v-bind="props" 
                            width="100%"
                            @click="showMessage(room[1].key.chatRoomId, room[1].value)"
                            >
                            <v-sheet class="elevation-3 bg-transparent">
                                <v-col class="profile_pic_container">
                                    <div>
                                        <v-avatar>
                                        <v-img class="profile_pic"
                                            :src="room[1].value.avatar ?? '/src/assets/imgs/blank_profile_pic.png'" />
                                        </v-avatar>
                                        {{ getFullName(room[1].value.firstName, room[1].value.middleName, room[1].value.lastName) }}
                                    </div>
                                </v-col>
                                <v-col>
                                    <v-row class=" pa-3">
                                        <span v-if="room[1].key.chatContents.      length>0" 
                                            v-html="formatText(room[1].key.chatContents[0].message)">
                                        </span>
                                        <!-- <span  v-if="room[1].key.chatContents.      length>0" ref="textContainer" class="text-container">
                                            {{ room[1].key.chatContents[0].message }}
                                        </span> -->
                                        <span v-else></span> 
                                    </v-row>
                                </v-col>
                            </v-sheet>
                                <v-col class="message_time pa-2">
                                    {{ formatDate(room[1].key.endedDateTime) }}
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
import { getFullName, formatDate } from '@/utils/common';
import { showMessage } from './showMessage';
import eventBus from '@/stores/eventBus';
import MessageStore from '@/stores/MessageStore';

export default {
    props: {
        chatRooms: Object,
    },
    data() {
        return {
            getFullName,
            formatDate,
            showMessage,
            formatText,
        }
    },
    mounted() {
        eventBus.on('updateChatRoomContent', this.updateContext)

        // this.truncateText();
        // window.addEventListener("resize", this.truncateText);
    },
    beforeDestroy() {
        //window.removeEventListener("resize", this.truncateText);
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
        }
    }
}

function formatText(text) {
    const n = 30;
    return (text.length > n) ? text.slice(0, n-1) + '&#8230;' : text;
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
</style>