<template>
    <v-col style="text-align: righ; margin-right: 32px; margin-top: 4px; ">
        <div class="justify-end text-right" v-if="getUser">
            <v-menu transition="scroll-x-reverse-transition" >
                <template v-slot:activator="{ props }">
                    <v-avatar v-bind="props" class="onHover">
                        <img :src="getUserAvatar(getUser.avatar)" height="40" /> <!--todo: get the avatar if user visits someone else's page-->
                    </v-avatar>
                </template>
                <v-sheet>
                    <v-list class="py-0"
                    v-for="n in menuItems"
                        :key="n"
                        link>
                        <v-list-item @click="menuHandler(n)" class="py-0">
                        <template v-slot:prepend>
                            <v-icon>{{ n.icon }}</v-icon>
                                <v-list-item-title class="pl-3" v-text="n.title"
                                :class="n.icon == 'mdi-home' && 'userName'">
                            </v-list-item-title>
                        </template>
                        </v-list-item>
                    </v-list>
                </v-sheet>
            </v-menu>
        </div>
    </v-col>
    
    <v-dialog
      v-model="this.showSettingsOption"
      width="800"
      persistent
    >
        <user-settings  @closeModal="closeModal()" />
    </v-dialog>
</template>

<script>
import { getUserAvatar } from '@/utils/common';
import store from '@/stores/UserStore';
import { logoutUser } from '@/utils/auth.js';
import SettingsComponent from '@/components/SettingsComponent.vue';

export default {
    components: {
        'user-settings': SettingsComponent
    },
    created() {
        if (this.getUser != null) {
            this.menuItems.unshift({
                title: this.getUser.firstName + " " + this.getUser.lastName, 
                icon:'mdi-home'
            })
        }
    },
    data() {
        return {
            getUserAvatar,
            
            menuItems: [
                { title: 'Help', icon: 'mdi-help' },
                { title: 'Settings', icon: 'mdi-cog' },
                { title: 'Logout', icon: 'mdi-logout' },
            ],
            
            id: '',
            firstName: '',
            middleName: '',
            lastName: '',
            Friends: '',
            birthOfPlace: '',
            logoutUser,

            showSettingsOption: false,
        }
    },
    methods: {
        menuHandler(action) {
            console.log(action.title)
            if (action.title == "Help") {
                //Todo: create the help and help view
            } else if (action.title == "Settings") {
                this.showSettingsOption = !this.showSettingsOption;
            } else if (action.title == "Logout") {
                logoutUser();
                store.dispatch('clearUserData')
                store.dispatch('clearStore');
                this.$router.push({name: 'home'});
            } else { //ProfilePage
                this.$router.push({name: 'profile'})
            }
        },
        
        closeModal() {
            this.showSettingsOption = false;
        }
        
    },
    computed: {
        getUser() {
            return store.state.user
        },
        
    }, 
}
</script>

<style scoped>

.userName {
    font-weight: bold;
}

div.v-list-item {
    padding: 0px
}
</style>