<template>
    <!-- {{ getOpenedChatRooms }} -->
    <div 
    class="py-1 onHover glow-head" 
    v-for="room in getOpenedChatRooms">
    <v-tooltip :text="room.user.firstName" location="right" open-delay="1000">
        <template v-slot:activator="{ props }">
            <v-avatar size="42" class="elevation-3" v-bind="props" @click="switchChatHead(room.user)">
                <v-img :src="getUserAvatar(room.user.avatar)" />
            </v-avatar>
        </template>
    </v-tooltip>
    </div>

</template>

<script>
import MessageStore from '@/stores/MessageStore';
import { getUserAvatar } from '@/utils/common.js';
import { ref } from 'vue';

var testData = ref([]);

export default {
    data() {
        return {
            getUserAvatar,
            testData,
        }
    },
    computed: {
        getOpenedChatRooms() {
            return MessageStore.getters.getChatHeads();
        },
    },
    methods: {
        switchChatHead(user) {
            MessageStore.dispatch('switchMessageTab', user);
        }
    }
}
</script>

<style scoped>

.glow-head:hover {
    color: #fdec6e;
    text-shadow:0px 0px 30px #fdec6e;
    -moz-transition: all 0.2s ease-in;
    -o-transition: all 0.2s ease-in;
    -webkit-transition: all 0.2s ease-in;
    transition: all 0.2s ease-in;
}

</style>