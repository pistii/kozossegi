<!--This is the card element used for searched people, and to list the friends-->
<template>
    <v-layout>
        <v-card color="#1b4e54" theme="dark" max-width="15rem" class="text-center pa-3 rounded">
            {{ user.publicityStatus }}

            <v-card-title>
                <RouterLink :to="'/profile='+user.id" class="authorName">
                    {{ user.personalInfo.firstName }} {{ user.personalInfo.lastName }}
                </RouterLink>
            </v-card-title>
                <v-avatar size="130" rounded="3">
                    <v-img :src="getUserAvatar(user.personalInfo.avatar)" />
                </v-avatar>
                <v-card-title>
                    <div style="font-family: Arial; font-size: 1.2vh;">Születési hely:</div>
                    <div style="font-family: Arial; font-size: 1.2vh;">
                        {{ user.personalInfo.placeOfBirth }}
                    </div>
                    <div>
                        {{ getYears(user.personalInfo.dateOfBirth) }}
                    </div>
                </v-card-title>
                <v-card-actions class="justify-center">
                    <v-btn v-if="user.publicityStatus !== 'friend'" 
                    @click="handleUserRequest(user.personalInfo)" 
                    variant="tonal" 
                    color="secondary" 
                    class="userFullName"
                    :text="user.publicityStatus == 'friendRequestSent' ? 'Jelölés visszavonása' : 'Ismerősnek jelöl'"></v-btn>
                    
                    <v-btn v-else-if="user.publicityStatus === 'friend'"
                    text="Profil megtekintése"
                    @click="this.$router.push({path: 'profile='+user.personalInfo.id})"
                    >
                    </v-btn>
                    
                    <v-btn v-else
                    text="Profilomra!"
                    @click="this.$router.push({name: 'profile'})"
                    >
                    </v-btn>
                </v-card-actions>
            </v-card>
    </v-layout>
</template>

<script>
import { getUserAvatar } from '@/utils/common';
import moment from 'moment';
import fetchData from '@/stores/server_routes'
import store from '@/stores/UserStore.js'
import { ref } from 'vue';

var userId = ref(0);
export default {
    props: {
        user: Object
    },
    mounted() {
        userId.value = store.getters.getUserId();
    },
    data() {
        return {
            getUserAvatar,
            userId
        }
    },
    methods: {
        getYears(birthYear) {
            let birthDate = moment(birthYear);
            let age = moment().diff(birthDate, 'years');
            return age + ' éves';
        },

        async handleUserRequest(user) {
            var data = {
                SenderId: store.getters.getUserId(),
                ReceiverId: user.id,
                NotificationType: 0
            }
            var resp = await fetchData.methods.fetchData('POST', 'PostFriendRequest', data);
            if (resp == 'Success') {
                console.log("ismerősnek jelölés elküldve");
                this.user.publicityStatus = 'friendRequestSent';
                console.log(this.user)
            }
        }
    }
}
</script>

<style scoped>

.userFullName {
    font-size: 13px;
    word-wrap: wrap;
}

@media screen and (min-width: 600px) {
  span.v-btn__content.userFullName {
    font-size: 19px;
  }
}

@media screen and (max-width: 600px) {
    span.v-btn__content.userFullName {
    font-size: 1vw;
  }
}

@media screen and (max-width: 480px) {
    span.v-btn__content.userFullName {
    font-size: 15px;
  }
}
</style>