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
    </div>   
    <div v-if="activeMenu=='audio'">
        <AudioRecorder v-if="this.recording"/>
        <div v-else>
            <v-row no-gutters align="center">
                <v-col>
                    <audioVisualizer :totalWidth="250" class="audio-visualizer-container" :newAudio="this.newAudio" />
                </v-col>
                <v-col class="audio-visualizer-container justify-space-between">
                    <v-tooltip text="Vissza" location="top" 
                    open-delay="1000">
                        <template v-slot:activator="{ props }">
                            <v-btn class="w-100" size="x-small" v-bind="props">
                                <v-icon size="20" tag="back" start="false" end="false">mdi-keyboard-backspace</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                    
                    <v-tooltip 
                    text="Küldés" 
                    location="top"
                    open-delay="1000">
                        <template v-slot:activator="{ props }">
                            <v-container 
                            fluid 
                            class="onHover fill-height py-3 px-1" 
                            fill-height 
                            style="height: 100%;"
                            >
                                <v-icon 
                                size="34" 
                                color="green" 
                                class="textbox-send-icon"
                                v-bind="props"
                                >mdi-send-circle</v-icon>
                            </v-container>

                        </template>
                    </v-tooltip>
                </v-col>
                </v-row>
        </div>
    </div>
    <TextBox v-if="activeMenu=='text'"/>
    
</template>

<script>
import eventBus from '@/stores/eventBus';

import audioVisualizer from '@/components/audioVisualizer.vue';
import EmojiPickerComponent from '../EmojiPickerComponent.vue';
import AudioRecorder from '@/views/Message/MessagePage/audioRecorder.vue';

import TextBox from './ChatTextBox.vue'

    export default {
        components: {
            audioVisualizer,
            EmojiPicker: EmojiPickerComponent,
            AudioRecorder,
            TextBox,
            
        },
        data() {
            return {
                newAudio: null,
                activeMenu: 'text',
                recording: true,
            }
        },
        mounted() {
            eventBus.on('newAudioCreated', this.insertAudio)
            eventBus.on('selectedEmoji', this.addEmoji) //Subscribe to the emoji picker component
        },
        methods: {
            addEmoji(emoji) {
                this.messageTo += emoji;
            },

            insertAudio(audio) {
                this.newAudio = audio
                this.activeMenu = 'audio'
                this.recording = false;
            },

            toggleMenu(className) {
                this.activeMenu = className;
            },
        },

        computed: {
            computedClasses() {
                return {
                    active: this.activeMenu === 'text',
                }
            }
        },

        
        beforeDestroy() {
            eventBus.off('newAudioCreated', this.insertAudio());
            eventBus.off('selectedEmoji', this.addEmoji());
        },
    }
</script>

<style>
.chat-menu-icon-row {
    background: linear-gradient(#72d0e8, #2f8f96);
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

.audio-visualizer-container {
    border: 1px solid #bfbdbd; 
    box-shadow: inset 0 0 20px #bfbdbd;
}

.textbox-send-icon {
    box-shadow: 0 0 10px 1px #5ad15f; 
    border-radius: 50%;
}
</style>