<template>
    <v-container>
        <v-row>
            <v-col v-for="(user, n) in userArray[0]" :key="user.id" >
                <v-card class="mr-5 ml-5" color="#1b4e54" theme="dark" max-width="200" :title="user.firstName + ' ' + user.lastName"
                    :class="['justify-center align-center bg-secondary', `elevation-${13}`]">
                    <v-avatar size="130" rounded="3">
                        <v-img :src=getUserAvatar(user.avatar)></v-img>
                    </v-avatar>
                    
                        <v-btn @click="sendFriendRequest(user)" :text='checkedUser ? "Jelölve" : "Jelölés"' :key="n">
                        </v-btn>
                        <v-btn><RouterLink :to="{ path:'/profile='+user.id }">Profil megtekintése</RouterLink></v-btn>
                    
                </v-card>
            </v-col>
            <v-col>
                <Pagination :totalItems="totalItems" v-if="isVisible"/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import store from '@/stores/PaginationStore';
import UserStore from '@/stores/UserStore';
import fetchData from '@/stores/server_routes.js';
import eventBus from '@/stores/eventBus';

import PaginationComponent from '@/components/PaginationComponent.vue'
import { addFriend } from './ProfilePage/ProfilePageHeaderComponent.vue';
import { getUserAvatar } from '@/utils/common';

import { ref, } from 'vue';
var data = ref('');

const userArray = ref([]);
var response = ref('');
var checkedUser = ref(false);

export default {
    components: {
        Pagination: PaginationComponent,
    },
    props: {
        currentPage: Number
    },
    computed: {
        page () {
            return store.state.currentPage
        }
    },
    watch: { //checks if the store currentPage changes, and starts a new data request
        async page(newVal) {
            userArray.value = [];
            await fetchData.methods.fetchData('GET', 'GetAllPeople', null, this.userId, newVal)
                .then(value => {
                    userArray.value.push(value.data);
                    this.totalItems = value.totalPages;
                });
        }
        
    },
    mounted() {
        eventBus.on("getAllFriends", this.SearchContext)
    },
    created() { //load the data
        this.SearchHandler()
    },
    data() {
        return {
            userArray,
            data,
            checkedUser, 
            response,
            totalItems: 0, isVisible: false,
            userId: UserStore.state.userId,
            addFriend, getUserAvatar
        }
    },
    methods: {
        async sendFriendRequest(user) { //TODO a komponens szétválasztása a "jelölve/jelölés btn felirat" miatt
            addFriend(user);
            checkedUser.value = !checkedUser.value
            console.log(this.totalItems)
        },
        SearchContext(context) { //This method triggers when the eventBus called from ProfilePage Show More friends option
            this.SearchHandler("GetAllFriends", context)
        },
        async SearchHandler(searchParameter, data) { //The handler, if 
            if (searchParameter === undefined) {
                response = await fetchData.methods.fetchData('GET', 'GetAllPeople', null, this.userId, 1)
                    .then(value => {
                        userArray.value.push(value.data);
                        console.log(value)
                        this.totalItems = value.totalPages;
                        this.isVisible = true
                    });
                }
            else if (searchParameter === "GetAllFriends") {
                userArray.value.push(data); //Receives the 50 friends from the friendsComponent
            }
        },
        
    },
    beforeUnmount() {
        eventBus.off('getAllFriends', this.SearchContext)
    }

}

</script>
<style scoped>
body {
    margin: 0;
    overflow: hidden;
}

#particles-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>