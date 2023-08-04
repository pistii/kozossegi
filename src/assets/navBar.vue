<template>
    <nav v-if="true">
        <v-row>
            <RouterLink to="/" style="text-decoration: none; color: inherit;">
                <v-col cols="3">
                    <h2>
                        SocialStream
                    </h2>
                </v-col>
            </RouterLink>
            <v-col cols="6">
                <RouterLink to="/searchPeople"><svg-icon type="mdi" :path="pAccount"></svg-icon></RouterLink>
                <RouterLink to="/myProfile"><svg-icon type="mdi" :path="pHome"></svg-icon></RouterLink>
                <v-icon type="mdi" @click="search">mdi-magnify</v-icon>
            </v-col>
            <v-col cols="3">

                <v-icon path="pMagnify">mdi-magnify</v-icon>

                <v-row justify-right width="200" class="searchBarContainer">
                    <v-text-field v-model="searchText" :loading="loading" class="justify-right" :append-inner-icon="true"
                    :prepend-icon="icon"

                    style="display:inline-block; min-width: 400px;">
                    <template #append-inner>
                        <RouterLink to="/searchResult">
                            <svg-icon type='mdi' :path="mdiMagnify"/>
                        </RouterLink>
                    </template>
                    </v-text-field>
                </v-row>
            </v-col>
        </v-row>
        <v-divider></v-divider>
    </nav>
</template>

<script>
import accountGroup from '../assets/imgs/account-group.vue';
import TextAreaWithButton from '/src/components/TextAreaWithButton.vue';
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiHomeCircle } from '@mdi/js'
import { mdiAccountGroup } from '@mdi/js'
import searchPeople from '../components/searchPeople.vue';
import { mdiMagnify } from '@mdi/js'
import { mdiCloseCircle } from '@mdi/js'
import { ref } from 'vue'
function isloggedIn() {
    return true;
}

export default {
    components: {
        SvgIcon,
        'accountGroup': accountGroup,
        'text-area-with-button': TextAreaWithButton,
        'mdi-close-circle': mdiCloseCircle,

    },
    data() {
        return {
            searchText : "",
            pAccount: mdiAccountGroup,
            pHome: mdiHomeCircle,
            loading: false,
            mdiMagnify : mdiMagnify,
        }
    },
}

</script>

<style>
.searchBarContainer {
    position: relative;
    width: 300px;
}

.text-field {
    position: absolute;

}

.search_btn {
    justify-content: right;
    text-align: right;
    position: absolute;
}
</style>