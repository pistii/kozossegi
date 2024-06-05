<template>
    <div class="chat-menu-icon-row"> <!--Ikonok elrendezése-->
        <EmojiPicker :activeMenu="this.activeMenu"/>
            <v-icon
            :class="{ active: this.activeMenu == 'audio'}"
            class="px-6 py-3 mb-2 menu" 
                @click="toggleMenu('audio')"
                >
                mdi-microphone
            </v-icon>
            <v-icon  
            :class="{ active: this.activeMenu == 'text'}"
                class="px-6 py-3 mb-2 menu" 
                @click="toggleMenu('text')">
                mdi-keyboard
            </v-icon>
            <imageSender />
            
    </div>

    <div v-if="activeMenu=='audio'">
        <AudioRecorder v-if="this.recording" @newAudioCreated="passUrlToChild"/>
        <AudioSender v-else 
        :url="this.url"
        @recording="toggleRecording"
        @activeMenu="toggleMenu"
        />
    </div>
    <TextBox v-if="activeMenu=='text'"/>
    
</template>
<script>
import EmojiPickerComponent from '../EmojiPickerComponent.vue';
import AudioRecorder from '@/views/Message/MessagePage/audioRecorder.vue';
import imageSender from './ImageSender.vue';
import AudioSender from './AudioSender.vue';
import TextBox from './ChatTextBox.vue'


export default {
    components: {
        EmojiPicker: EmojiPickerComponent,
        AudioRecorder,
        TextBox, 
        imageSender,
        AudioSender,
        
    },
    data() {
        return {
            activeMenu: 'text',
            recording: true,
            url: null,
        }
    },
    methods: {
        passUrlToChild(url) {
            this.url = url;
            this.recording = false;
        },
        toggleMenu(className) {
            this.activeMenu = className;
        },
        toggleRecording(value) {
            this.recording = value;
        }
    },

    computed: {
        computedClasses() {
            return {
                active: this.activeMenu === 'text',
            }
        }
    },
}
</script>

<style scoped>
.chat-menu-icon-row {
    background: linear-gradient(#72d0e8, #50a8ae, #72d0e8);
}
.active {
    margin-left: 3px;
    background: linear-gradient(#2f8f96, #72d0e8);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom: 2px;
    border-bottom: 1px solid white;
}

.active-enter-active,
.active-leave-active {
  transition: opacity 0.5s, transform 0.5s ease;
}

.active-enter, .active-leave-active {
  opacity: 0;
  transform: translateY(-100px);
}

</style>