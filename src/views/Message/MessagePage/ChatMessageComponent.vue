<template>
    <div :class="{ 'mx-2 d-flex justify-end' : msg.authorId === userId}"
        class="ma-2 d-flex" > 
        <span v-if="msg.chatFile !== null">
            <!-- {{ msg.chatFile }} -->
            <audioPlayer :audio="msg.chatFile"/>
        </span>
        
        <div v-else>
            <v-sheet :class="{ 'ma-2 pa-3 d-flex bg-green rounded wrapContent' : msg.authorId === userId}"
            class="ma-2 pa-3 d-flex bg-blue rounded wrapContent" @click="this.expandDate = !this.expandDate">
            {{ msg.message }}
            </v-sheet>
        </div>
    </div>
    <v-expand-transition >
            <v-card
            v-show="this.expandDate"
            height="auto"
            width="auto" 
            class=" text-primary bg-transparent text-center elevation-0 messageStatus"
            
            >{{formatDate(msg.sentDate)}}
            <span v-if="msg.status==0 && msg.authorId === userId" class="font-italic">
                <v-icon  size="20" class="justify-end" >
                    mdi-check-circle
                </v-icon>
                Látta
            </span>

            <span v-if="msg.status==1  && msg.authorId === userId" class="font-italic">
                <v-icon  size="20" class="justify-end" >
                    mdi-check
                </v-icon>
                Elküldve
            </span>

            <span v-if="msg.status==2  && msg.authorId === userId" class="font-italic">
                <v-icon  size="20" class="justify-end" >
                    mdi-check-circle-outline
                </v-icon>
                Megérkezett
            </span>
            </v-card>

        </v-expand-transition>
</template>
<script>
import UserStore from '@/stores/UserStore'
import { formatDate } from '@/utils/common';
import audioPlayer from './audioPlayer.vue';

export default {
    components: {
        audioPlayer
    },
    props: {
        msg: Object,        
    },
    data() {
        return {
            userId: UserStore.state.userId,
            expandDate: false,
            formatDate,
        }
    },
    updated() {
        this.expandDate = false
    }
}
</script>

<style>
.messageStatus {
    font-size: smaller;
}

.wrapContent {
    max-width: 20vw;
    word-break: break-word;
}

</style>