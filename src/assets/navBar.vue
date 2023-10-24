<template>
    <nav v-if="true">
        <v-row>
            <v-col cols="3">
                <RouterLink v-if="this.isLoggedin()" to="/" style="text-decoration: none; color: inherit;">
                    <h2 class="navBarLeftPane">SocialStream</h2>
                </RouterLink>
                <RouterLink v-else to="/myProfile" style="text-decoration: none; color: inherit;">
                    <h2 class="navBarLeftPane">SocialStream</h2>
                </RouterLink>
            </v-col>
            <v-col cols="4" class="navBarMiddleIcons">
                <RouterLink to="/myProfile"><svg-icon type="mdi" :path="pHome"></svg-icon></RouterLink>
                <RouterLink to="/searchPeople"><svg-icon type="mdi" :path="pAccount"></svg-icon></RouterLink>
                <RouterLink to="/messages"><svg-icon type="mdi" :path="pMessage"></svg-icon></RouterLink>
                <a href="javascript:void(0)">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <svg-icon type="mdi" :path="mdiBell" color="primary" v-bind="props" />
                        </template>
                        <v-list>
                            <v-list-item v-for="item in notificationMenuItems[0]" 
                            :key="notificationFrom" 
                            :value="index" 
                            @click="clickedOnNotification(item.notificationId, item.isReaded)" 
                            :title="item.notificationFrom" :subtitle="item.notificationContent" append-inner-icon="mdi-circle">
                                <svg-icon v-if="!item.isReaded" type="mdi" 
                                :path="mdiCircleSmall" color="green" />
                                <v-list-item-title class="text-caption">{{ item.createdAt }}</v-list-item-title>
                                {{ item.content }}
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </a>
            </v-col>
            <v-col cols="3" class="pt-8">
                <v-row justify-right class="searchBarContainer">
                    <v-text-field v-model="searchText"  :loading="loading" class="justify-right mr-5"
                        style="display:inline-block; ">
                        <template #append-inner>
                            <v-btn @click="search()"><svg-icon type='mdi' :path="mdiMagnify" /></v-btn>
                        </template>
                    </v-text-field>
                </v-row>
            </v-col>
            
            <!--
                https://vuetifyjs.com/en/components/menus/
                https://vuetifyjs.com/en/components/dialogs/
            -->
            <v-col>
                <v-row class="justify-end px-8 pt-5">
                    <v-expand-x-transition>
                        <v-menu transition="scroll-x-reverse-transition">
                        <template v-slot:activator="{ props }">
                            <v-btn :icon="true" v-bind="props" @click="expand = !expand">
                                <v-icon v-if="!avatar">mdi-account</v-icon>
                                <img v-else :src="avatar" />
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                            v-for="n in items"
                            :key="n"
                            link
                            >
                            <template v-slot:prepend>
                                <v-list-item-icon>
                                    <v-icon>{{ n.icon }}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title class="pl-3" v-text="n.title" @click="menuHandler(n)">
                                </v-list-item-title>
                            </template>
                            </v-list-item>
                            
                        </v-list>
                    </v-menu>
                    </v-expand-x-transition>
                </v-row>
            </v-col>
            
        </v-row>
    </nav>
    <SettingsComponent v-if="showSettingsOption" :showSettingsOption="this.showSettingsOption"/>
</template>

<script >
import accountGroup from '../assets/imgs/account-group.vue';
import TextAreaWithButton from '/src/components/TextAreaWithButton.vue';
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiHomeCircle, 
    mdiAccountGroup, 
    mdiMagnify, 
    mdiCloseCircle, 
    mdiMessageBulleted, 
    mdiBell, 
    mdiCircleSmall } from '@mdi/js'

import { ref } from 'vue';
import router from '/src/router/index.js';
import { isLoggedin, loginUser, logoutUser } from '../utils/auth.js'
import { fetchData } from '../stores/server_routes';
import SettingsComponent from '../components/SettingsComponent.vue';

var peopleMatch = ref([]);
const notificationMenuItems = ref([]);
const ls = JSON.parse(localStorage.getItem('userInfo')).personal

export default {
    props: {
        avatar: String,
        props: Object 
    },
    setup() {
       
        fetchData('GetNotifications').then(function(result) {
            notificationMenuItems.value.push(result)
        })
    },
    components: {
        SvgIcon,
        'accountGroup': accountGroup,
        'text-area-with-button': TextAreaWithButton,
        'mdi-close-circle': mdiCloseCircle,
        'mdi-message': mdiMessageBulleted,
        'mdi-notification': mdiBell,
        'mdi-circle-small': mdiCircleSmall,
        SettingsComponent,
    },
    data() {
        return {
            searchText: '',
            pAccount: mdiAccountGroup,
            pHome: mdiHomeCircle,
            pMessage: mdiMessageBulleted,
            mdiMagnify: mdiMagnify,
            mdiBell,
            mdiCircleSmall,
            loading: false,

            id: '',
            firstName: '',
            middleName: '',
            lastName: '',
            Friends: '',
            birthOfPlace: '',

            notificationMenuItems,
            peopleMatch,

            //Menu
            items: [
                { title: 'Help', icon: 'mdi-help' },
                { title: 'Settings', icon: 'mdi-cog' },
                { title: 'Logout', icon: 'mdi-logout' },
            ],
            fullName: this.getFullName(),
            avatar: ls.avatar,
            expand:false,

            showSettingsOption: false,
            isLoggedin
        }
    },
    methods: {
        search() {
            fetchData('Search', this.searchText).then((val) => { 
                peopleMatch.value.push(val);
                router.push("/searchResult");
            }); //val => peopleMatch.value.push(val), router.push("/searchResult"));
        },
        clickedOnNotification(id, read) {
            if (!read)
            {
                fetchData('NotificationRead', id);
            }
        },
        getFullName() {
            let hasMiddleName = ls.middleName || ''
            const userName = ls.firstName + " " + hasMiddleName + " " + ls.lastName
            return userName;
        },
        menuHandler(action) {
            if (action.title == "Help") {
                //Todo: help and help view
            } else if (action.title == "Settings") {
                this.SettingsOption();
            } else {
                logoutUser();
            }
        },
        SettingsOption() {
            this.showSettingsOption = !this.showSettingsOption;
        }

    }
}

export { peopleMatch }
</script>

<style>
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