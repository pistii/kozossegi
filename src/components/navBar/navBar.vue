<template>
    <nav >
        <v-row >
            <div class=" flex-container">
                <brandName :isLoggedin="isLoggedin()" />
                <v-col lg="6" md="5" sm="3" xs="2" class="navBarMiddleIcons col-sm-2"  v-if="isLoggedin()">
                    <navButtons />
                </v-col>

                <v-col cols="5" md="3" class="pt-4 searchBarContainer" v-if="isLoggedin()">
                    <navSearch />
                </v-col>
                <!--
                    https://vuetifyjs.com/en/components/menus/
                    https://vuetifyjs.com/en/components/dialogs/
                -->
                <v-col style="text-align: righ; margin-right: 32px; margin-top: 4px; ">
                    <div class="justify-end text-right" v-if="getUser">
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
                    </div>
                </v-col>
            </div>
        </v-row>
        <v-divider></v-divider>
    </nav>
    <SettingsComponent v-if="showSettingsOption" 
    :showSettingsOption="this.showSettingsOption"/>
</template>

<script >
import TextAreaWithButton from '@/components/TextAreaWithButton.vue';
import SettingsComponent from '@/components/SettingsComponent.vue';
import brandName from './brandName.vue'
import navButtons from './navButtons.vue'
import navSearch from './navSearch.vue'

import { getUserAvatar } from '@/utils/common';

import router from '@/router/index.js';
import { isLoggedin, logoutUser } from '@/utils/auth.js';
import store from '@/stores/UserStore';
import MessageStore from '@/stores/MessageStore.js';
import { formatDate } from '@/utils/common';
 

export default {
    props: {
    },
    
    components: {
        "text-area-with-button": TextAreaWithButton,
        SettingsComponent,
        brandName,
        navButtons,
        navSearch
    },
    computed: {
        getUser() {
            return store.state.user
        },
    }, 
    data() {
        return {

            id: '',
            firstName: '',
            middleName: '',
            lastName: '',
            Friends: '',
            birthOfPlace: '',
            
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



.navBarMiddleIcons {
    text-align: center;
    margin-block: 15px;
    white-space: nowrap;
}

.navBarMiddleIcons svg {
    margin-inline: 5px;
}

.userName {
    text-decoration: none;
    padding-inline: 15px;
}
</style>