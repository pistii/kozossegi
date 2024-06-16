<template>
    <div v-if="chatRooms != null" v-for="(key, value, index) in Object.entries(chatRooms)">
        <v-row> 
            <v-hover>
                <template v-slot:default="{ isHovering, props }">
                    <v-col class="profile_pic_container" >
                        <v-card @click="showMessage(key[1].key.chatRoomId, key[1].value)"
                        :color="isHovering ? 'primary' : undefined" 
                        v-bind="props" 
                        
                        class="px-6 elevation-3" width="100%" 
                        variant="tonal" 
                        >
                            <v-avatar >
                                <v-img class="profile_pic"
                                :src="key[1].value.avatar ?? '/src/assets/imgs/blank_profile_pic.png'" />
                            </v-avatar>
                            {{ getFullName(key[1].value.firstName, key[1].value.middleName, key[1].value.lastName) }}
                        </v-card>
                    </v-col>
                </template>
            </v-hover>
        </v-row>
    </div>
</template>

<script>
//import MessageStore from '../../stores/MessageStore';
import { getFullName } from '@/utils/common';

export default {
    props: {
        chatRooms: Object,
    },
    data() {
        return {
            getFullName,
        }
    },
    setup() {
        //MessageStore.commit('setCurrentRoomId', )
    },
    methods: {
        showMessage(roomId, content) {
            
        }
    }
}
</script>