<template>
    <div class="bg-blue-darken-2 panelNavHeader">
        <v-row class="justify-end justify-space-evenly">
            <span >
                <div class="truncateText">
                    <v-avatar size="30" >
                        <img :src="getUserAvatar(userInfo?.user?.avatar)" height="30" />
                    </v-avatar> 
                    <div class="nameTab">
                        {{ getFullName(userInfo?.user?.firstName, userInfo?.user?.middleName, userInfo?.user?.lastName) }}
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
            <v-btn class="mr-3" @click="closeWindow()" variant="plain" size="x-small">
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
    computed: {
        dataIsLoading() {
            return MessageStore.getters.getLoadingState();
        },
        userInfo() {
            return MessageStore.getters.getActiveChat();
        }
    },
    data() {
        return {
            getFullName, getUserAvatar,
            DEFAULT_CONTAINER_HEIGHT: 10,
            containerHeight: this.DEFAULT_CONTAINER_HEIGHT, // Kezdeti érték
            minimalized: false,
            temporaryData: {
                user: {
                    avatar: '',
                    firstName: '',
                    middleName: '',
                    lastName: ''
                }
            },
        }
    },
    methods: {        
        minimalizeWindow() {
            if (this.minimalized) {
                this.containerHeight = 420;
                this.minimalized = false;
                this.$emit('setChatContainerHeight', this.containerHeight);
            }
            else {
                this.containerHeight = this.DEFAULT_CONTAINER_HEIGHT;
                this.minimalized = true;
                this.$emit('setChatContainerHeight', this.containerHeight);
            }
        },
        closeWindow() {
            console.log(this.userInfo.user.id)
            MessageStore.dispatch('removeOpenedChatRoom', this.userInfo.user.id);
        },
    },
}
</script>
<style scoped>


.panelNavHeader {
    border-radius: 30px;
    max-height: 25px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

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
</style>