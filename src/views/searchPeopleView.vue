<template>
    <v-container class="d-flex justify-center cc">
        <v-row>
            <v-col v-for="(user, n) in userArray[0]" :key="n" cols="12" sm="4" lg="auto" md="auto" xl="auto">
                <v-card class="mr-5 ml-5" color="#1b4e54" theme="dark" max-width="200" :title="user.firstName + ' ' + user.lastName"
                    :class="['justify-center align-center bg-secondary', `elevation-${x}`]">
                    <v-avatar size="130" rounded="3">
                        <v-img v-if="user.avatar" :src="user.avatar" /> <v-img v-else src="/src/assets/imgs/blank_profile_pic.png"></v-img>
                    </v-avatar>
                    <v-card-actions>
                        <v-btn @click="friendRequest(user.id)"><div v-if="checkedUser">Jelölve</div><div v-else>Jelölés</div></v-btn>
                    </v-card-actions>
                    <v-card-action>
                        <v-btn><RouterLink :to="{ path:'/profile='+user.id }">Profil megtekintése</RouterLink></v-btn>
                    </v-card-action>
                </v-card>
            </v-col>
                <Pagination :totalItems="totalItems" v-if="isVisible"/>
        </v-row>
    </v-container>

</template>

<script>
import { fetchData } from '../stores/server_routes.js';
import { ref, watch } from 'vue';
import PaginationComponent from '../components/PaginationComponent.vue'
import store from '../stores/PaginationStore';
import { mapState, mapMutations, mapGetters } from 'vuex';
import { provide } from 'vue';

var data = ref('');

const userArray = ref([]);
var response = ref('');
var checkedUser = ref(false);
//var totalItems = ref(null);

export default {
    components: {
        Pagination: PaginationComponent,
    },
    props: {
        currentPage: Number
    },
    computed: {
        ...mapGetters(['currentPage']),
        page () { //its for the watcher, 
            return store.state.currentPage
        }
    },
    watch: { //checks if the vuex getter currentPage changes, then starts a new data request
        async page(newVal) {
            userArray.value = [];
            await fetchData('GetAllPeople', newVal)
                            .then(value => {
                                userArray.value.push(value.data);
                                this.totalItems = value.totalItems;
                            });
        }
        
    },
    async created() { //load the data
        response = await fetchData('GetAllPeople', 1)
                            .then(value => {
                                userArray.value.push(value.data);
                                this.totalItems = value.totalItems;
                                
                                this.totalItems = value.totalItems;
                                this.isVisible = true
                            });
    },
    data() {
        return {
            userArray,
            data,
            checkedUser, 
            response,
            totalItems: 0, isVisible: false
        }
    },
    methods: {
        friendRequest(id) {
            console.log(store.getters.currentPage)

            // data = JSON.stringify({
            //     "requestFrom": userId,
            //     "requestTo": id  //to whom send the request
            // })
            // var send = fetchData('PostFriendRequest', data).then(result => console.log(result)) 
            // checkedUser.value = !checkedUser.value
        },

    }
}

</script>
<style>
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