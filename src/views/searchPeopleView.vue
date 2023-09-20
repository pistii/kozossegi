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
        </v-row>
    </v-container>
</template>

<script>
import { fetchData } from '../stores/server_routes.js';
import { ref } from 'vue';
//Todo: Get the json parameters properly
var data = ref('');

const x = 12
const userId = 190; //Todo: redefine
const userArray = ref([]);
var response = ref('');
var checkedUser = ref(false);
export default {
    async created() {
        response = await fetchData('GetAllPeople', userId).then(value => userArray.value.push(value))
    },
    data() {
        return {
            userArray,
            data,
            checkedUser
        }
    },
    methods: {
        friendRequest(id) {
            data = JSON.stringify({
                "requestFrom": userId,
                "requestTo": id  //to whom send the request
            })
            var send = fetchData('PostFriendRequest', data).then(result => console.log(result)) 
            checkedUser.value = !checkedUser.value
        }
    }
}
</script>

<style></style>