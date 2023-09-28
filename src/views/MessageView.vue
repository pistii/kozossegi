<template>
    <v-container>
        <v-row>
            <v-col cols="5">
                <v-row>
                    <h3>Messages</h3>
                </v-row>
                <v-row>
                    <v-text-field placeholder="Search..." v-model="search" single-line :loading=this.loading
                        prepend-inner-icon="mdi-magnify" rounded density="compact" variant="solo-filled"
                        @click:prepend-inner="onSearchMessage"></v-text-field>
                </v-row>
                <div>
                    <div v-for="(room, index) in chatRooms">
                        <div v-for="item in room.chatContents">
                            <v-row class="pb-5">
                                <v-hover>
                                    <template v-slot:default="{ isHovering, props }">
                                        <v-card class="px-2" 
                                            variant="tonal" 
                                            :color="isHovering ? 'primary' : undefined" 
                                            v-bind="props" width="100%" 
                                            @click="showMessage(room.chatRoomId)">
                                            <v-col class="profile_pic_container">
                                                <div>
                                                    <img class="profile_pic" src="/src/assets/imgs/blank_profile_pic.png" />
                                                </div>
                                            </v-col>
                                            <v-col>
                                                <v-row >
                                                    <span class="overflowing-text">{{ item.message }}
                                                    </span>
                                                </v-row>
                                            </v-col>
                                            <v-col class="message_time">
                                                {{ formatDate(room.endedDateTime) }}
                                            </v-col>
                                        </v-card>
                                    </template>
                                </v-hover>
                            </v-row>

                        </div>
                    </div>
                </div>
            </v-col>

            <v-col style="position: relative; max-height: 600px;">
                <v-container class="messaging_area" id="messaging_area" v-for="item in chatContent">
                    <v-row>
                        <div class="messageFrom">
                            <img class="profile_pic" src="/src/assets/imgs/blank_profile_pic.png" />
                            {{ item }}

                        </div>
                    </v-row>
                </v-container>
                <v-row style="max-height: 600px;">
                    <EmojiPicker v-if="EmojiVisible" @emoji_click="handleEmojiClick" />
                    <svg-icon type="mdi" :path="mdiEmoticon" class="emoticon" @click="onEmojiPicker"></svg-icon>
                    <AudioRecorder v-if="menuOpen" class="audioPopup"></AudioRecorder>
                    <v-text-field class="messageBox" placeholder="Type here your message..."
                        append-inner-icon="mdi-send-circle" v-model="messageTo" @click:append-inner="onSendMessage">
                        <svg-icon class="microphoneIcon" type="mdi" :path="mdiMicrophone" @click="openMicrophoneDialog">
                        </svg-icon>
                    </v-text-field>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script >
import $ from 'jquery'
import { ref, onMounted, watch } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiMicrophone } from '@mdi/js'
import { mdiEmoticon } from '@mdi/js'
import EmojiPicker from '../components/EmojiPicker.vue'
import json from '../emojis-data.json'
import AudioRecorder from '../components/audioRecorder.vue'
import audioPlayer from '../components/audioPlayer.vue'
import { fetchData } from '../stores/server_routes.js';
import moment from 'moment'

let response = ref([]);
let data = ref([]);
let chatContent = ref([]);

export default {
    setup() {
        onMounted(async () => {
            const userId = 19;
            try {
                data.value = await fetchData('GetAllChatRoom', 19);
                console.log(data)
            }
            catch (error) {
                console.log(error);
            }
        })
        // fetchData('GetMessages', 11)
        //     .then(value => response.value = value)
        //     .catch((error) => console.log(error)); 
    },
    props: {
        menuOpen: Boolean,
        EmojiVisible: Boolean,
    },
    components: {
        SvgIcon,
        EmojiPicker,
        AudioRecorder,
        audioPlayer

    },
    data() {
        return {
            mdiMicrophone: mdiMicrophone,
            mdiEmoticon: mdiEmoticon,
            loaded: false,
            loading: false,
            search: '',
            messageTo: '',
            menuOpen: false,
            EmojiVisible: false,
            'Frequently used': {
                emojiname: ''
            },
            response,
            chatRooms: data,
        }
    },
    methods: {

        callback(data) {
            console.debug(data)
        },
        onSearchMessage() {
            this.loading = true

        },
        onSendMessage() {
            if (this.messageTo.length > 0) {
                var e = $('<div class="messageTo">' + this.messageTo + '<img class="profile_pic" src="/src/assets/imgs/blank_profile_pic.png" /></div>');
                $("#messaging_area").append(e)
                this.messageTo = ''
            }
        },
        openMicrophoneDialog() {
            this.menuOpen = !this.menuOpen;
        },
        onEmojiPicker() {
            this.EmojiVisible = !this.EmojiVisible
        },
        handleEmojiClick(emoji) {
            this.messageTo += emoji;
            var keys = Object.keys(json['Frequently used'])
            var items = Object.entries(json);
            var hozzaad = {
                'emoji': emoji
            }
            //Todo: Store the recently used emojis in db
            console.log(items[0][1]);
            items[0][1]["emoji"] = emoji
            for (var i = 0; i < items.length; i++) {
                for (let key in items[i]) {
                    items.keys += emoji

                    // if (items[i][key].indexOf(emoji) != -1) {
                    //     console.log(items[i])
                    // }
                }
            }
        },

        formatDate(date) {
            const today = new Date();
            let passedTime = today.getDate() - moment(date).date();
            if (passedTime > 1) { //Ha több mint egy nap telt el
                return moment(date).format("YYYY-MM-DD")
            }
            else {
                return moment(date).format("HH:mm")
            }
        },

        async showMessage(chatRoomId) {
            try {
                let content = await fetchData('GetChatContent', chatRoomId);
                chatContent.value.push(content);
                console.log(content);
            }
            catch (error) {
                console.log(error);
            }        
        }
    }
}
</script>

<style>
.profile_pic_container {
    padding-right: 0;
}

.profile_pic {
    border-radius: 50%;
    width: 30px;
}

.message_time {
    text-align: right;
    padding-top: 0;
    padding-right: 0;
}

.messaging_area {
    max-height: 80%;
    overflow-y: scroll;
}

.messageBox {
    position: absolute;
    bottom: 0px;
    right: 0px;
    min-width: 100%;
    padding-left: 12px;
}

.messageFrom {
    margin-inline: 12px;
    display: inline-block;
    width: fit-content;
    height: 30px;
    margin-top: 50px;
    border: 1px dashed #ffffff;
    align-items: flex-start;
}

.messageTo {
    overflow-wrap: break-all;
    float: right;
    word-break: break-all;
    height: 30px;
    margin-right: 12px;
    margin-top: 30px;
    margin-bottom: 12px;
    border: 1px dashed #ffffff;
}

.microphoneIcon {
    cursor: pointer;
}

.audioPopup {
    position: absolute;
    bottom: 15%;
    right: 0px;
    min-width: 100%;
    padding-left: 12px;
}

.emoticon {
    cursor: pointer;
    bottom: 15%;
    right: 0;
    height: 17px;
    position: absolute;
}

.overflowing-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 5px;
}

.messageContainer {
    overflow: hidden;
}
</style>