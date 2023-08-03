<template>
    <nav v-if="true">
        <RouterLink to="/searchPeople"><svg-icon type="mdi" :path="pAccount"></svg-icon></RouterLink>
        <RouterLink to="/myProfile"><svg-icon type="mdi" :path="pHome"></svg-icon></RouterLink>
        
        <v-text-field class="justify-right" style="display:inline-block; min-width: 400px;"/>
        <v-btn class="search_btn">Keres</v-btn>
        
        
    
    </nav>
    <v-row class="py-5">
        <v-container >
        
    </v-container>

        
    </v-row>
</template>

<script>
import accountGroup from '../assets/imgs/account-group.vue';
import TextAreaWithButton from '/src/components/TextAreaWithButton.vue';
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiHomeCircle } from '@mdi/js'
import { mdiAccountGroup } from '@mdi/js'
import searchPeople from '../components/searchPeople.vue';

function isloggedIn() {
    return true;
}

export default {
    components: {
        SvgIcon,
        'accountGroup': accountGroup,
        'text-area-with-button': TextAreaWithButton
    },
    data() {
        return {
            pAccount: mdiAccountGroup, 
            pHome: mdiHomeCircle
        }
    }
}
</script>

<style>
.searchBarContainer {
    position: relative;
    width: 100%;
}

.text-field {
    position: absolute;
    width: 100%;
    
}

.search_btn {
    justify-content: right;
    text-align: right;
    position: absolute;
}
</style>