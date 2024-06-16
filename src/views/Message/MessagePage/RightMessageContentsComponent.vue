<template>
    <v-col style="position: relative; min-height: 50vw;" >
        <v-container class="text-center" v-show="content?.value?.firstName != undefined">
            <v-sheet style="background-color: #4489ff44;" rounded> <!--todo: show if online here-->
                <RouterLink  :to="{ path:'/profile='+ content?.value?.userId }">
                    <v-avatar>
                        <v-img class="profile_pic"
                            :src="getUserAvatar(content?.value?.avatar)" ></v-img>
                    </v-avatar>
                    <p>
                    {{ getFullName(content?.value?.firstName, content?.value?.middleName, content?.value?.lastName) }}
                    </p>
                </RouterLink>
            </v-sheet>
                
        </v-container>
        <v-container class=" absolute">
            <v-progress-circular
                :width="3"
                color="blue"
                indeterminate
                v-show="loadMoreMessage_Progress"
            >
            </v-progress-circular>
        </v-container>

        <v-container class="messaging_area scrollbar scroll_msg_pane pb-8 " 
        v-if="content" 
        ref="parent">
            <span v-for="message in content.key.chatContents" :key="content.key.chatContents.messageId">
                <chat-msg-comp  :msg="message" />
            </span>
            
            <Observer @intersect="handleIntersection" 
                    :options="{ threshold: 0 }" />            
        </v-container>
        <v-container v-else><p>Még nincs megjelenítendő beszélgetés...</p></v-container>
         
        <ChatCardWidgetFooter :userId="content?.value?.userId"/>
        
    </v-col>
</template>

<script>
import EmojiPicker from './EmojiPicker.vue'
import ChatMessageComponent from './ChatMessageComponent.vue'
import AudioRecorder from './audioRecorder.vue'
import audioPlayer from './audioPlayer.vue'
import Observer from '@/components/Observer.vue'
import { ref, nextTick } from 'vue';

import { getFullName, getUserAvatar } from '@/utils/common';
import fetchData from '@/stores/server_routes';
import ChatCardWidgetFooter from '@/components/ChatCard/ChatCardWidgetFooter.vue';
import ChatCardWidgetBody from '@/components/ChatCard/ChatCardWidgetBody.vue';

const loadMoreMessage_Progress = ref(false);
const cp = ref(1);
const totalPg = ref(null);
var chatRoomId = ref(null);

var prevScrollHeight = ref(null);

export default {
    props: {
        content: Object
    },
    components: {
        EmojiPicker,
        AudioRecorder,
        audioPlayer,
        ChatCardWidgetFooter, ChatCardWidgetBody,

        'chat-msg-comp' : ChatMessageComponent,
        Observer,
    },
    setup(props) {
        const parent = ref(null);
        const loadMoreMessage = async () => {
            chatRoomId.value = props.content.key.chatRoomId;
            cp.value ++;
            var response = await fetchData.methods.fetchData('GET', 'GetChatContent', null, chatRoomId.value, cp.value);
            totalPg.value = response.totalPages;
            if (response.roomId == chatRoomId.value) {
                //console.log(props.content.key.chatContents);
                props.content.key.chatContents = [...props.content.key.chatContents, ...response.data];
            }
        };

        const handleIntersection = () => {
            if (props.content !== undefined) {
                //console.log("totalPg" + props.content.totalPages + "cp: " + cp.value);
                if (chatRoomId.value !== null) {
                    if (chatRoomId.value !== props.content.key.chatRoomId) {
                        cp.value = 1;
                        totalPg.value = null;
                    }
                }
                if (totalPg.value >= cp.value || totalPg.value == null) { 
                    prevScrollHeight.value = parent.value.$el.scrollTop;
                    loadMoreMessage().then(() => {
                        scrollBack();                        
                    });
                } else {
                    console.log("elérted a maximumot.");
                }
            }
        };
        
        const scrollBack = () => {
            if (parent.value.$el)
                parent.value.$el.scrollTop = prevScrollHeight.value; 
            
        };

        return { handleIntersection, parent }
    },
    data() {
        return {
            getFullName, getUserAvatar,
            cp,
            totalPg,
            loadMoreMessage_Progress,
        }
    },
    methods: {
        scrollToBottom() {
            const container = this.$refs.parent;
            if (container !== undefined) {
                const scrollHeight = container.$el.scrollHeight;
                container.$el.scrollTop = scrollHeight;
            }
        },
        stayBottom() {
            nextTick(() => {
                this.scrollToBottom();
            });
        },
    },
}

</script>

<style scoped>
.emoticon {
    cursor: pointer;
    right: 0;
    height: 17px;
}

.absolute {
    position: absolute;
}

.messaging_area {
    scroll-snap-type: y proximity;
    overflow-y: scroll;
    height: 80vh;
    display: flex;
    flex-direction: column-reverse;
}

</style>