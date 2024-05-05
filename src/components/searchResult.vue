<template>
    <v-row no-gutters>
        <v-container class="d-flex flex-wrap " v-if="searchResult.length > 0">
            <v-col cols="4" v-for="user in searchResult">
                <UserCard :user="user" />
            </v-col>
        </v-container>

        <v-container v-else>
            Nincs a keresésnek megfelelő eredmény.
        </v-container>
    </v-row>
</template>

<script>
import { reactive, ref } from 'vue';
import eventBus from '@/stores/eventBus.js';
import UserCard from '@/components/UserCard.vue';

var searchResult = ref([]);

export default {
    components: {
        UserCard,
    },
    mounted() {
        eventBus.on('searchResult', (val) => {
            searchResult.value = val
        });
    },
    data() {
        return {
            friendRequestStatus: reactive({}),
            searchResult,
        }
    },
    
    beforeDestroy() {
        eventBus.$off('searchResult')
    }
}

</script>

<style scoped>
.authorName {
    color: #528cbbef; 
    font-family:'Franklin Gothic Medium'; 
    text-decoration: none;
}
</style>