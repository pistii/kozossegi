<template>
    <nav class="navBar">
        <v-row v-if="display.smAndDown" class="justify-center">
            <mobileView  />
        </v-row>
        <v-row v-else>
            <div class=" flex-container">
                <brandName :isLoggedin="isLoggedin()" />
                <v-col class="navBarMiddleIcons"  v-if="isLoggedin()">
                    <navButtons />
                </v-col>
                <v-col class="pt-4 searchBarContainer" cols="auto" v-if="isLoggedin()">
                    <navSearch />
                </v-col >
                <navMenu />
            </div>
        </v-row>

        <v-divider></v-divider>
    </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const display  = ref(useDisplay())

</script>

<script >
import TextAreaWithButton from '@/components/TextAreaWithButton.vue';
import brandName from './brandName.vue';
import navButtons from './navButtons.vue';
import navSearch from './navSearch.vue';
import navMenu from './navMenu.vue';
import mobileView from './mobileView.vue';

import { isLoggedin } from '@/utils/auth.js';

export default {
    components: {
        "text-area-with-button": TextAreaWithButton,
        brandName,
        navButtons,
        navSearch,
        mobileView,
        navMenu
    },
    
    data() {
        return {
            isLoggedin,
        }
    },
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
    min-width: 400px;
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

</style>