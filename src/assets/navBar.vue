<template>
    <nav >
        <v-row class="navBar" >
            <div  class=" flex-container">
            <v-col cols="3">
                <RouterLink v-if="isLoggedin()" to="/myProfile" style="text-decoration: none; color: inherit;">
                    <h2 class="navBarLeftPane">SocialStream</h2>
                </RouterLink>
                <RouterLink v-else to="/" style="text-decoration: none; color: inherit;">
                    <h2 class="navBarLeftPane">SocialStream</h2>
                </RouterLink>
            </v-col>
            <v-col cols="4" class="navBarMiddleIcons" >
                <div v-if="isLoggedin()">
                    <RouterLink to="/myProfile" class="pa-1">
                        <v-badge color="transparent"  class="pa-1">
                            <v-icon>mdi-home-circle</v-icon>
                        </v-badge>
                    </RouterLink>
                    <RouterLink to="/searchPeople"  class="pa-1">
                        <v-badge content="1" color="error"  class="pa-1">
                            <v-icon class="pa-1">mdi-account-group</v-icon>
                        </v-badge>
                    </RouterLink>
                    <RouterLink to="/messages" class="pa-1">
                        <v-badge 
                        class="pa-1"
                        :color="messageLen>0 ? 'error' : 'transparent'"
                        :content="messageLen>0 ? 
                        messageLen : undefined" >
                            <v-icon>mdi-message-bulleted</v-icon>
                        </v-badge>
                    </RouterLink>
                    <a href="javascript:void(0)" class="pa-1">
                        <v-menu :close-on-content-click="true" :absolute="true" width="400" scroll-strategy="none">
                            <template v-slot:activator="{ props }" >
                                <v-badge color="transparent"  class="pa-1">
                                    <v-icon v-bind="props"  @click="getNotifications()">mdi-bell</v-icon>
                                </v-badge>
                            </template>

                            <v-list  v-for="item in notificationMenuItems[0]" bg-color="blue-lighten-5">
                                <!-- {{ item }} -->

                                <!-- create new friend request notification message-->
                                
                                <v-list-item 
                                @click="clickedOnNotification(item.notificationId, item.isNew)" 
                                :prependAvatar="getUserAvatar(item.notificationAvatar)" 
                                class="elevation-5 mx-1 text-truncate "
                                >
                                <template v-slot:append v-if="item.isNew">
                                    <v-icon color="green"> mdi-circle-medium </v-icon> 
                                </template>

                                <div class="w-100">
                                    <span class="text-start text-caption">
                                        {{ this.formatDate(item.createdAt) }}
                                    </span>
                                    <span class="pl-2">
                                        {{ item.notificationContent }}
                                    </span>

                                    <!--
                                        FriendRequest = 0,
                                        FriendRequestAccepted = 1,
                                        Birthday = 2,
                                        NewPost = 3
                                    -->
                                </div>
                                    <v-list-item-title v-if="item.notificationType === 0" > <!--Csak akkor jelenik meg, ha barát kérelem történt--> 
                                        
                                        <v-sheet class="text-right" color="transparent">
                                            <v-btn 
                                            density="compact" 
                                            color="deep-purple" 
                                            class="px-1 my-1" 
                                            size="small" 
                                            height="20" 
                                            @click="confirmRequest(item)" 
                                            text="Megerősít"/>
                                            <v-btn density="compact" 
                                            class="ml-3 px-1"    
                                            size="small"
                                            height="20"
                                            color="grey-lighten-2" 
                                            @click="rejectRequest(item)" text="Elutasít"/>
                                        </v-sheet>
                                    </v-list-item-title>
                                </v-list-item>
                                
                            </v-list>
                        </v-menu>
                    </a>
                </div>
            </v-col>
            <v-col class="pt-8" cols="3">
                <v-row class="searchBarContainer" >
                    <v-text-field
                        class="mr-5"
                        v-model="searchText"  
                        :loading="loading"
                        style="display:inline-block;"
                        v-on:keyup.enter="search()">
                        <template #append-inner>
                            <v-btn @click="search()" >
                                <v-progress-circular
                                    v-if="loading"
                                    indeterminate
                                    color="primary"
                                ></v-progress-circular>
                                <v-icon v-else>mdi-magnify</v-icon>
                            </v-btn>
                            
                        </template>

                    </v-text-field>
                </v-row>
            </v-col>
            <!--
                https://vuetifyjs.com/en/components/menus/
                https://vuetifyjs.com/en/components/dialogs/
            -->
            <v-col>
                <v-row class="justify-end px-8 pt-5"  v-if="isLoggedin() && getUser" >
                        <v-menu transition="scroll-x-reverse-transition" >
                        <template v-slot:activator="{ props }">
                            <v-avatar v-bind="props" class="onHover">
                                <img :src="getUserAvatar(getUser.avatar)" height="40" /> <!--todo: get the avatar if user visits someone else's page-->
                            </v-avatar>
                        </template>
                        <v-list>
                            <v-list-item
                            v-for="n in menuItems"
                            :key="n"
                            link
                            >
                            <template v-slot:prepend>
                                <v-icon>{{ n.icon }}</v-icon>
                                <v-list-item-title class="pl-3" v-text="n.title" @click="menuHandler(n)">
                                </v-list-item-title>
                            </template>
                            </v-list-item>
                            
                        </v-list>
                    </v-menu>
                </v-row>
            </v-col>
            </div>
        </v-row>
        <v-divider></v-divider>
    </nav>
    <SettingsComponent v-if="showSettingsOption" 
    :showSettingsOption="this.showSettingsOption"/>
</template>

<script >
import SettingsComponent from '../components/SettingsComponent.vue';
import TextAreaWithButton from '@/components/TextAreaWithButton.vue';

import { ref } from 'vue';
import router from '/src/router/index.js';
import { isLoggedin, logoutUser } from '../utils/auth.js'
import fetchData from '../stores/server_routes';
import store from '../stores/UserStore';
import { formatDate, getUserAvatar } from '../utils/common';

var peopleMatch = ref([]);
const notificationMenuItems = ref([]);

export default {
    props: {
    },
    
    components: {
        'text-area-with-button': TextAreaWithButton,
        SettingsComponent,
    },
    computed: {
        messageLen() {
            return store.state.messageHub.length
        },
        getUser() {
            return store.state.user
        },
    }, 
    data() {
        return {
            searchText: '',
            loading: false,

            id: '',
            firstName: '',
            middleName: '',
            lastName: '',
            Friends: '',
            birthOfPlace: '',

            notificationMenuItems,
            peopleMatch,
            
            menuItems: [
                { title: 'Help', icon: 'mdi-help' },
                { title: 'Settings', icon: 'mdi-cog' },
                { title: 'Logout', icon: 'mdi-logout' },
            ],

            showSettingsOption: false,
            isLoggedin, formatDate, getUserAvatar,
            userId: store.state.userId,
        }
    },
    created() {
        if (this.getUser != null) {
            this.menuItems.unshift({
                title: this.getUser.firstName + " " + this.getUser.lastName, 
                icon:'mdi-home'
            })
        }
    },
    methods: {
        async search() {
            peopleMatch.value = [];
            if (this.searchText !== "") {
                this.loading = true;

                await fetchData.methods.fetchData('GET', 'Search', null, store.state.userId, this.searchText)
                .then((val) => { 
                    console.log(val)
                    peopleMatch.value.push(val);
                    setTimeout(() => {
                        router.push("/searchResult");
                    }, 2000);
                });
                this.searchText = null;
                this.loading = false;
            }
        },
        menuHandler(action) {
            
            if (action.title == "Help") {
                //Todo: help and help view
            } else if (action.title == "Settings") {
                this.SettingsOption();
            } else if (action.title == "Logout") {
                logoutUser();
                store.dispatch('clearUserData')
                store.dispatch('clearStore');
                this.$router.push({name: 'home'});
            } else {
                router.push({name: 'profile'})
                console.log("home");
            }
        },
        SettingsOption() {
            this.showSettingsOption = !this.showSettingsOption;
        },
        
        async clickedOnNotification(id, isNew) {
            if (isNew)
            {
                //await fetchData.methods.fetchData('GET', 'NotificationRead', null, id).then(response => console.log(response));
            }
        },
        async confirmRequest(notification) { 
            const postData = {
                UserId: store.getters.getUserId(),
                FriendId: notification.notificationFrom,
                NotificationId: notification.notificationId
            }
            var resp = await fetchData.methods.fetchData('POST', 'AcceptFriendRequest', postData) 

            var notificationToModify = notificationMenuItems.value[0].find(n => n.notificationId === resp.notificationId);
            notificationToModify.notificationContent = resp.notificationContent;
            notificationToModify.isNew = resp.isNew;
        },
        rejectRequest(notification) { //todo: test this function
            console.log("reject")//todo
            
        },
        async getNotifications() {
            //this.getGeolcation()

            if (isLoggedin() && this.userId > 0) {
                try {
                    await fetchData.methods.fetchData('GET', 'GetNotifications', null, this.userId)
                    .then(resp => notificationMenuItems.value.push(resp));
                } catch (error) {
                    console.error('Error while getting notifications:', error);
                }
            }
        },
        async getGeolcation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.showPosition);
            } else { 
                document.getElementById("demo").innerHTML =
                "Geolocation is not supported by this browser.";
            }
        },
        showPosition(position) {
            console.log(
            "Latitude: " + position.coords.latitude + "<br>" +
            "Longitude: " + position.coords.longitude)
        },
    }
}

export { peopleMatch }
</script>

<style>
.navBar {
    background: linear-gradient(to bottom, rgb(135, 144, 154) 0%,rgba(89,148,202,1) 62%,rgba(95,154,207,0.7) 68%,rgba(19, 105, 171, 0) 100%);
}

.flex-container {
    display: flex;
    flex: 1
}

.searchBarContainer {
    position: relative;
    width: auto;
    min-width: 200px;
}

.searchBarContainer .v-btn {
    background-color: transparent;
}

.text-field {
    position: absolute;

}

.search_btn {
    justify-content: right;
    text-align: right;
    position: absolute;
}

.navBarLeftPane {
    text-align: center;
    margin: 20px;
}

.navBarMiddleIcons {
    text-align: center;
    margin-block: 15px;
}

.navBarMiddleIcons svg {
    margin-inline: 5px;
}

.userName {
    text-decoration: none;
    padding-inline: 15px;
}
</style>