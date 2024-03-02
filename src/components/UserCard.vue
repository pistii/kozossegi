<!--This is the card element used for searched people, and to list the friends-->
<template>
    <v-layout>
        <v-card color="#1b4e54" theme="dark" max-width="15rem" class="text-center pa-3 rounded">
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
                    <v-btn v-if="user.publicityStatus == 'non-friend'" @click="addFriend(user.personalInfo)" variant="tonal" color="secondary" text="Jelölés"></v-btn>
                    
                </v-card-actions>
            </v-card>
    </v-layout>
</template>

<script>
import { getUserAvatar } from '@/utils/common';
import moment from 'moment';
import fetchData from '@/stores/server_routes'


export default {
    props: {
        user: Object
    },
    data() {
        return {
            getUserAvatar
        }
    },
    methods: {
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