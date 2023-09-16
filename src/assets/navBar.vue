<template>
    <nav v-if="true">
        <v-row>
            <v-col cols="3">
                <RouterLink to="/" style="text-decoration: none; color: inherit;">
                    <h2 class="navBarLeftPane">SocialStream</h2>
                </RouterLink>
            </v-col>
            <v-col cols="6" class="navBarMiddleIcons">
                <RouterLink to="/myProfile"><svg-icon type="mdi" :path="pHome"></svg-icon></RouterLink>
                <RouterLink to="/searchPeople"><svg-icon type="mdi" :path="pAccount"></svg-icon></RouterLink>
                <RouterLink to="/messages"><svg-icon type="mdi" :path="pMessage"></svg-icon></RouterLink>
                <a href="javascript:void(0)">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <svg-icon type="mdi" :path="mdiBell" color="primary" v-bind="props" />
                        </template>
                        <v-list>
                            <v-list-item v-for="item in notificationMenuItems[0]" :key="notificationFrom" :value="index" @click="clickedOnNotification(item.notificationId, item.isReaded)" :title="item.notificationFrom" :subtitle="item.notificationContent" append-inner-icon="mdi-circle">
                                <svg-icon v-if="!item.isReaded" type="mdi" :path="mdiCircleSmall" color="green" />
                                <v-list-item-title class="text-caption">{{ item.createdAt }}</v-list-item-title>
                                {{ item.content }}
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </a>
            </v-col>
            <v-col cols="3">
                <v-row justify-right width="200" class="searchBarContainer">
                    <v-text-field v-model="searchText" :loading="loading" class="justify-right"
                        style="display:inline-block; margin-right: 100px;">
                        <template #append-inner>
                            <v-btn @click="search"><svg-icon type='mdi' :path="mdiMagnify" /></v-btn>
                        </template>
                    </v-text-field>
                </v-row>
            </v-col>
        </v-row>
        <v-divider></v-divider>
    </nav>
</template>

<script >
import accountGroup from '../assets/imgs/account-group.vue';
import TextAreaWithButton from '/src/components/TextAreaWithButton.vue';
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiHomeCircle } from '@mdi/js'
import { mdiAccountGroup } from '@mdi/js'
import { mdiMagnify } from '@mdi/js'
import { mdiCloseCircle } from '@mdi/js'
import { mdiMessageBulleted } from '@mdi/js';
import { mdiBell } from '@mdi/js';
import { mdiCircleSmall } from '@mdi/js';
import $ from 'jquery';
import { ref } from 'vue';
import router from '/src/router/index.js';
import { BASE_URL } from '../stores/server_routes.js';
import { isLoggedin, loginUser } from '../utils/auth.js'
import { fetchData } from '../stores/server_routes';

const unwrapped = BASE_URL + "/api/navigation/search/";
var responseData;
const notificationMenuItems = ref([]);
export default {
    setup() {
        fetchData('GetNotifications').then(function(result) {
            notificationMenuItems.value.push(result);
            //console.log(notificationMenuItems.value[0])
        });
    },
    props: {
        unwrapped: String
    },
    components: {
        SvgIcon,
        'accountGroup': accountGroup,
        'text-area-with-button': TextAreaWithButton,
        'mdi-close-circle': mdiCloseCircle,
        'mdi-message': mdiMessageBulleted,
        'mdi-notification': mdiBell,
        'mdi-circle-small': mdiCircleSmall
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

            notificationMenuItems
        }
    },
    methods: {
        search() {
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: unwrapped + this.searchText,
                type: "get",
                data: {
                    'firstName': this.firstName,
                    'middleName': this.middleName,
                    'lastName': this.lastName,
                    'Friends': this.Friends,
                    'birthOfPlace': this.birthOfPlace
                },
                success: function (data) {
                    responseData = data
                    router.push("/searchResult");
                },
                error: function (data) {
                    console.log("server not available");
                },
            });
        },
        clickedOnNotification(id, read) {
            if (!read)
            {
                fetchData('NotificationRead', id);
            }
        }
    }
}

export { responseData }

</script>

<style>
.searchBarContainer {
    position: relative;
    width: 300px;
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
</style>