<template>
    <v-row no-gutters>
        <v-container class="d-flex flex-wrap " v-if="searchResult">
            <v-col cols="4" v-for="user in searchResult[0]">
                <v-layout>
                <v-card color="#1b4e54" theme="dark" max-width="15rem" class="text-center pa-3 rounded">
                    <v-card-title>
                        <RouterLink :to="'/profile='+user.id" class="authorName">
                            {{ user.firstName }} {{ user.lastName }}
                        </RouterLink>
                    </v-card-title>
                        <v-avatar size="130" rounded="3">
                            <v-img :src="getUserAvatar(user.avatar)" />
                        </v-avatar>
                        <v-card-title>
                            <div style="font-family: Arial; font-size: 1.2vh;">Születési hely:</div>
                            <div style="font-family: Arial; font-size: 1.2vh;">
                                {{ user.placeOfBirth }}
                            </div>
                            <div>
                                {{ getYears(user.dateOfBirth) }}
                            </div>
                        </v-card-title>
                        <v-card-actions class="justify-center">
                            <v-btn @click="addFriend(user)" variant="tonal" color="secondary" :text="friendRequestStatus[user.id] ?? 'Jelölés'"></v-btn>
                            <v-progress-circular
                                indeterminate
                                color="primary"
                            ></v-progress-circular>
                        </v-card-actions>
                    </v-card>
            </v-layout>
            </v-col>

        </v-container>
        <v-container v-else>
            Nincs a keresésnek megfelelő eredmény.
        </v-container>
    </v-row>
</template>

<script setup>
import { peopleMatch } from '@/assets/navBar.vue';
import { getUserAvatar } from '@/utils/common';
import { reactive } from 'vue';
import moment from 'moment';
import store from '@/stores/UserStore';
import fetchData from '@/stores/server_routes'

var searchResult = peopleMatch;
console.log(searchResult)
</script>

<script>

export default {
    data() {
        return {
            friendRequestStatus: reactive({}),
            
        }
    },
    methods: {
        navigateToUserpage(id) {
            this.$router.push("/profile=" + id);
        },
        getYears(birthYear) {
            let birthDate = moment(birthYear);
            let age = moment().diff(birthDate, 'years');
            return age + ' éves';
        },

        async addFriend(user) {
            var request = {
                ApplicantId: store.getters.getUserId(),
                toUserId: user.id,
                NotificationType: 0
            }
            var resp = await fetchData.methods.fetchData('POST', 'PostFriendRequest', request);
            if (resp == 'Success') {
                console.log("ismerősnek jelölés elküldve");
                this.friendRequestStatus[user.id] = 'Jelölve';
                console.log(this.friendRequestStatus)
            }
        }
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