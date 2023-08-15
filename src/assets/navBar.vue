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
            </v-col>
            <v-col cols="3">

                <v-icon path="pMagnify">mdi-magnify</v-icon>
                <v-row justify-right width="200" class="searchBarContainer">
                    <v-text-field v-model="searchText" :loading="loading" class="justify-right" :append-inner-icon="true"
                        :prepend-icon="icon" style="display:inline-block; margin-right: 100px;">
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
import searchPeople from '../components/searchPeople.vue';
import { mdiMagnify } from '@mdi/js'
import { mdiCloseCircle } from '@mdi/js'
import { mdiMessageBulleted } from '@mdi/js';
import $ from 'jquery';
import {ref} from 'vue';
import BASEURL from '../components/Main.vue';
import router from '/src/router/index.js';
 
var searchText = ref();
var unwrapped = ref(BASEURL.value + 'api/navigation/search/');

function isloggedIn() {
    return true;
}

function search() {
    $.ajax({
        headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
    },
        url : unwrapped.value + this.searchText,
        type : "get",
        success : function (jqXHR) {
            alert(jqXHR.status);
            //router.push("/searchResult");
        },
        error : function (jqXHR) {
            console.log("error" + unwrapped.value);
        }
    });

}

export default {
    components: {
        SvgIcon,
        'accountGroup': accountGroup,
        'text-area-with-button': TextAreaWithButton,
        'mdi-close-circle': mdiCloseCircle,
        'mdi-message': mdiMessageBulleted
    },
    data() {
        return {
            searchText: this.searchText,
            pAccount: mdiAccountGroup,
            pHome: mdiHomeCircle,
            pMessage: mdiMessageBulleted,
            mdiMagnify: mdiMagnify,
            loading: false,
            search,
        }
    }
}

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