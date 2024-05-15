<template>
    <Transition name="slide-down">
        <div class="online_users_main" v-if="overlayOnlineFriendsMessagePanelIsOpen()">
            <v-sheet class="text-center onHover" @click="this.shouldShowOverlayOnlineFriendMessagePanel(false)" color="green" >
                Online ({{ getCurrentlyOnlineUsers }})
            </v-sheet>
            <v-sheet  max-height="190dvh" class="scrollbar scroll_panel">
                <v-virtual-scroll  v-if="usersToShow.length > 0"
                    :items="usersToShow">
                    <template v-slot:default="{ item }">
                        <v-list-item 
                        :value="item" 
                        color="primary" 
                        @click="sendMessageToUser(item)">
                            <v-list-item-title>
                                <v-card 
                                style="height: 35px;"
                                class="onHover mx-auto my-1 bg-blue-grey-lighten-5 pa-1" 
                                :title="getFullName(item.firstName, item.middleName, item.lastName) ">
                                    <template v-slot:prepend >
                                        <v-avatar size="30">
                                            <img :src="getUserAvatar(item.avatar)"  height="40" />
                                        </v-avatar>            
                                    </template>
                                    <template v-slot:append>
                                        <v-icon icon="mdi-circle-medium" :color="item.isOnline ? 'success' : 'red'"></v-icon>
                                    </template>
                                </v-card>
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                </v-virtual-scroll>
            </v-sheet>
            <div class="bg-blue-darken-2 px-2">
                <v-text-field class=" pt-2" density="compact"
                    placeholder="Start searching..."
                    v-model="searchTxt" 
                    >
                </v-text-field>
            </div>
        </div>
        <div v-else 
        class="online_users_main bottom_messagePanel_small" 
        @click="shouldShowOverlayOnlineFriendMessagePanel(true)">
            <v-sheet 
            class="text-center onHover" 
            color="green" >
                Online ({{ getCurrentlyOnlineUsers }})
            </v-sheet>
        </div>
    </Transition>
</template>

<script>
import UserStore from '@/stores/UserStore';
import MessageStore from '@/stores/MessageStore'
import {getUserAvatar, getFullName } from '@/utils/common';
import eventBus from '@/stores/eventBus';

import { ref } from 'vue';
import { isLoggedin } from '../utils/auth';

var onlineFriends = ref(UserStore.getters.getOnlineUsers());
const userFriends = ref(UserStore.getters.getUserFriends());

const MAX_ONLINE_USERS = 100;
const MIN_USERS_TO_RETURN = 30; 
const MAX_USERS_TO_RETURN = Math.floor(Math.random() * MAX_ONLINE_USERS); //0 és 100 között ad vissza egy értéket
const RANDOM_USER_TO_RETURN = MAX_USERS_TO_RETURN + MIN_USERS_TO_RETURN; //30 és 100 között ad vissza értéket
export default {
    computed: {
        
        usersToShow() { //TODO: Test the method with more than 30, and 100 users
            var usersQtToShow = this.userQtyToShow;
            let usersToReturn = [...UserStore.getters.getOnlineUsers()];
            //console.log("ONline friends: " + onlineFriends)
            //Ha az online user kevesebb mint a visszaadandó maximum user mennyisége akkor még adjon hozzá az offline userek közül
            if (usersToReturn <= usersQtToShow) 
            {
                var randomUsers = this.sortByStatusAndName(UserStore.getters.getUserFriends(), UserStore.getters.getOnlineUsers());
                usersToReturn.push(...randomUsers);
            }
            else { //Ha több az online user mint a megjelenítendő maximális mennyiség, akkor feldaraboljuk őket
                let slicedFriends = userFriends.value.slice(0, usersQtToShow);
                for (const item of slicedFriends) {
                    //Ha nem szerepel "item" az online userek öröklésből, akkor adja hozzá az offline usereket
                    if (!usersToReturn.some(obj2 => item.id === obj2.id)) 
                    {
                        usersToReturn.push(item)
                    }
                }
            }

            //Ha a szűrési mező nem üres akkor visszaadjuk a szűrési eredményeket
            if (this.searchTxt !== '') {
                const searchLowerCase = this.searchTxt.toLowerCase();
                return this.userFriends.filter((friend) =>
                    friend.firstName.toLowerCase().includes(searchLowerCase) ||
                    friend.lastName.toLowerCase().includes(searchLowerCase))
            }
            return usersToReturn;
        },
        
        userQtyToShow() { //30 és 100 között ad vissza egy értéket, vagy ha a user barátai kevesebb mint a MIN_USERS_TO_RETURN, akkor a barát lista mennyiségét
            let TOTAL_USER = UserStore.getters.getUserFriends();
            TOTAL_USER = TOTAL_USER === typeof(undefined) ? 0 : TOTAL_USER;
            let userNumToReturn = RANDOM_USER_TO_RETURN >
            //Ha a random több mint a teljes user mennyiség
            TOTAL_USER ? 
            //Adja vissza a teljes user mennyiséget
            TOTAL_USER : 
            //Máskülönben visszaadhatja a random mennyiséget 30 és 100 között
            RANDOM_USER_TO_RETURN;
            return userNumToReturn;
        },

        getCurrentlyOnlineUsers() {
            return UserStore.getters.getOnlineUsers().length;
        }
    },
    data() {
        return {
            onlineFriends,
            userFriends,
            getUserAvatar, getFullName,
            UserStore,
            MAX_USERS_TO_RETURN,
            searchTxt: '',
            isLoggedin,
        }
    },
    methods: {
        getRandomSubarray(arr, size) { //Ez most egyelőre nem kell
            var shuffled = arr.slice(0), i = arr.length, temp, index;
            while (i--) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            return shuffled.slice(0, size);
        },
        sendMessageToUser(user) {
            if (!MessageStore.getters.getOpenedChatRooms().includes(user)) {
                MessageStore.commit('addChatRooms', user);
            }
            MessageStore.commit('setPartner', user);
            MessageStore.commit('setPartnerId', user.id);
            //console.log(user)
            eventBus.emit('invoke-message-dialog-panel', false);
        },
        sortByStatusAndName(allUser, onlineUser) {
            let mergedUsers = [...onlineUser, ...allUser];
            //Először összefűzzük a két tömböt
            
            mergedUsers = mergedUsers.filter((user, index, self) =>
                index === self.findIndex((u) => u.id === user.id)
            );

            // Rendezés az online/offline státusz és más szempontok alapján
            mergedUsers.sort((a, b) => {
                // Először rendezés az online státusz alapján (online barátok előrébb kerülnek)
                if (onlineUser.some((user) => user.id === a.id) && !onlineUser.some((user) => user.id === b.id)) return -1;
                if (!onlineUser.some((user) => user.id === a.id) && onlineUser.some((user) => user.id === b.id)) return 1;

                // Ha mindkét barát online vagy offline, akkor más szempontok alapján rendezés
                // Például ABC sorrend alapján
                return a.firstName.localeCompare(b.firstName);
            });
            return mergedUsers;
            
        },
        overlayOnlineFriendsMessagePanelIsOpen() {
            if (isLoggedin()) {
                return UserStore.getters.getOverlayMessageFriendsState();
            }
            return false;
        },
        shouldShowOverlayOnlineFriendMessagePanel(expand) {
            UserStore.commit('setOverlayMessageFriendsPanelTo', expand);
        }
    }
}
</script>

<style>
.online_users_main {
    position: fixed; 
    right: 0;
    bottom: 0;
    width: 200px;
    max-width: 300px;
    
}

.onlineUsersContainer {
    scroll-snap-type: y proximity;
    overflow-y: scroll;
    flex-direction: column;
    display: flex;
    padding-inline: 4px;
}

.bottom_messagePanel_small {
    background-color: rgba(7, 14, 22, 0.623);
    margin-left: 30px;
    height: 3vh;
    min-width: 250px;
}

.scroll_panel {
    overflow-y: auto;
    max-height: 78vh;
}

/* .overlayMessageBox {
    scroll-snap-type: y proximity;
    overflow-y: scroll;
    flex-direction: column;
    display: flex;
    position: absolute;
    bottom: 0px;
    right: 0px;
    min-width: 100%;
    display: inline-block;
    flex-direction: column;
    border-radius: 8px;
} */

div.v-card-item, div.v-list-item {
    padding: 3px;
    padding-block: 1px;
}


.slide-down-enter-from, 
.slide-down-leave-to {
  transform: translateY(300px);
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.2s ease-out;
}

.slide-down-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

</style>