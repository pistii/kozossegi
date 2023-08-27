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
                    <v-text-field class="message" 
                        placeholder="Write here your message..."
                        append-inner-icon="mdi-send-circle" 
                        v-model="messageTo"
                        @click:append-inner="onSendMessage">

                    </v-text-field>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import $ from 'jquery'
import { ref } from 'vue'


export default {
    components: {
    },
    data() {
        return {
            loaded: false,
            loading: false,
            search: '',
            messageTo: '',
        }
    },
    methods: {
        onSearchMessage() {
            this.loading = true

        },
        onSendMessage() {
            var e = $('<div class="messageTo">'
                + '<img class="profile_pic" src="src/assets/imgs/blank_profile_pic.png" />'
                + this.messageTo + '</div>');
            $("#messaging_area").append(e)
            this.messageTo=''
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
}

.message {
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
    margin-left: 50px;
    border: 1px dashed #ffffff;
    align-items: flex-start;
}

.messageTo {
    display: inline-block;
    width:fit-content;
    min-width:50%;
    height: 30px;
    margin-top: 50px;
    margin-left: 50px;
    border: 1px dashed #ffffff;
    align-items:flex-end;
}
</style>