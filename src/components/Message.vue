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
                <div v-for="x in 10">
                    <v-row>
                        <v-col class="profile_pic_container">
                            <div>
                                <img class="profile_pic" src="src/assets/imgs/blank_profile_pic.png" />
                            </div>
                        </v-col>
                        <v-col>
                            <v-row>Gipsz Jakab</v-row>
                            <v-row>message </v-row>
                        </v-col>
                        <v-col class="message_time">
                            12:00
                        </v-col>
                    </v-row>
                </div>
            </v-col>

            <v-col style="position: relative;">
                <v-container class="messaging_area" id="messaging_area">
                    <v-row>
                        <div class="messageFrom">
                            <img class="profile_pic" src="src/assets/imgs/blank_profile_pic.png" />
                            Igazán hosszú üzenet
                            
                        </div>
                    </v-row>
                </v-container>
                <v-row>
                    <audioPlayer url="this.newAudio" />

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
import { ref } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiMicrophone } from '@mdi/js'
import { mdiEmoticon } from '@mdi/js'
import EmojiPicker from './EmojiPicker.vue'
import json from '../emojis-data.json'
import AudioRecorder from './audioRecorder.vue'
import audioPlayer from './audioPlayer.vue'

export default {
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
            }
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
            var e = $('<div class="messageTo">'
                + '<img class="profile_pic" src="src/assets/imgs/blank_profile_pic.png" />'
                + this.messageTo + '</div>');
            $("#messaging_area").append(e)
            this.messageTo = ''
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
    max-height: fit-content;
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
    display: inline-block;
    float: left;
    width: fit-content;
    height: 30px;
    margin-top: 50px;
    border: 1px dashed #ffffff;
    align-items: flex-start;
}

.messageTo {
    display: inline-block;
    width: fit-content;
    min-width: 60%;
    height: 30px;
    float: right;
    margin-top: 50px;
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
</style>