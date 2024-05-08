<template>
        <div class="flex-container pt-4" > <!--öröklött osztály a navBar-ból-->
            <v-row v-if="isLoggedin()" >
                <v-col cols="2" class="d-none d-sm-flex">

                </v-col>
                <v-col class="navBarMiddleIcons" > <!-- :style="{'width': 100% - txtAreaWidth + 'px'}" :cols="shouldExpandSearch ? '7' : '9'"-->
                    <navButtons  />
                </v-col>
                <v-col class="px-2" cols="auto" >
                    <v-btn v-if="!this.shouldExpandSearch"
                    class="pr-8"
                    @click="animateTxtBox()" 
                    variant="plain" 
                    icon="mdi-magnify" 
                    style="font-size: 13px; padding: 18px; float: right;"></v-btn>
                    <navSearch v-else  :style="{'width': txtAreaWidth + 'px'}" style="float: right;"/>
                </v-col>
                <v-col  cols="auto">
                    <navMenu />
                </v-col>
            </v-row>
        </div>
</template>

<script>
import navButtons from './navButtons.vue'
import navMenu from './navMenu.vue'
import navSearch from './navSearch.vue'
import { isLoggedin } from '@/utils/auth.js';

export default {
    components: {
        navSearch,
        navButtons,
        navMenu,
    },
    data() {
        return {
            shouldExpandSearch: false,
            txtAreaWidth: 0,
            isLoggedin,

        }
    },
    methods: {
        animateTxtBox() {
            this.shouldExpandSearch = true;
            const interval = setInterval(() => {
            if (this.txtAreaWidth >= 200) {
                clearInterval(interval);
            } else {
            this.txtAreaWidth += 5;
            }
        }, 10);
        },
        
    },
}
</script>

<style>
.txtArea {
    
}
</style>
