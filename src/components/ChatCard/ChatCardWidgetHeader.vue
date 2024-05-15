<template>
    <div class="bg-blue-darken-2 panelNavHeader">
        <v-row class="justify-end justify-space-evenly">
            <span class="onHover"
            v-for="person in getOpenedChatRooms"
            @click="switchMessageTab(person.id)" >
                <div class="truncateText">
                    <v-avatar size="30" >
                        <img :src="getUserAvatar(person.avatar)" height="30" />
                    </v-avatar> 
                    <div class="nameTab">
                        {{ getFullName(person.firstName, person.middleName, person.lastName) }}
                    </div>
                </div>
            </span>

            <!--main tab-->
            <v-btn 
            @click="minimalizeWindow()" 
            variant="plain" 
            size="x-small">
                <v-icon v-if="!minimalized">
                    mdi-minus
                </v-icon>
                <v-icon v-else >
                    mdi-square-outline
                </v-icon>
            </v-btn>
            <v-btn class="mr-3" @click="WindowHandler()" variant="plain" size="x-small">
                <v-icon>
                    mdi-close-circle
                </v-icon>
            </v-btn>
        </v-row>
    </div>
</template>

<script>
import { getFullName, getUserAvatar } from '@/utils/common';
import MessageStore from '@/stores/MessageStore';

export default {
    data() {
        return {
            getFullName, getUserAvatar,
            DEFAULT_CONTAINER_HEIGHT: 10,
            containerHeight: this.DEFAULT_CONTAINER_HEIGHT, // Kezdeti érték
            
            minimalized: false,
            
            tabVisible: true,
            getFullName,
        }
    },
    computed: {
        getOpenedChatRooms() {
            return MessageStore.getters.getOpenedChatRooms();
        }
    },
    methods: {
        switchMessageTab(id) {
            showMessage(key[1].key.chatRoomId, key[1].value)
        },
        
        minimalizeWindow() {
            if (this.minimalized) {
                this.containerHeight = 460;
                this.minimalized = false;
                this.$emit('setChatContainerHeight', this.containerHeight);
            }
            else {
                this.containerHeight = this.DEFAULT_CONTAINER_HEIGHT;
                this.minimalized = true;
                this.$emit('setChatContainerHeight', this.containerHeight);
            }
        },
        WindowHandler() {
            MessageStore.dispatch('removeOpenedChatRoom', MessageStore.getters.getPartnerId());
            
        }
    }
}
</script>
<style scoped>
.nameTab {
    transform: skewX(5deg);
    font-family: Verdana;
    display: inline;
    padding-inline: 8px;
}

.truncateText {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}


.panelNavHeader {
    border-radius: 30px;
    max-height: 25px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

</style>