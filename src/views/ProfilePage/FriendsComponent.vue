<template>
    <v-container>
        <v-sheet class="bg-info pa-2" rounded >
            <h4 color="indigo-lighten-5">
                Ismerősök
            </h4>
        </v-sheet>
        <div style="min-height: 20rem;" >
            <div v-if="friends.length==0" class="text-center align-center" style="padding-top: 25%;" >
                <span>Még nincsenek ismerőseid...</span>
                <div>
                    <a href="./searchPeople">Keress embereket...</a>
                </div>
            </div>
            <div  v-else >
                <v-row no-gutters justify="space-evenly" >
                    <v-col cols="3" xl="3" md="auto" class="mb-1 mx-1"  v-for="person in friends" :key="person">
                        <v-hover v-slot="{ isHovering, props }">
                            <v-card color="blue-darken-3 mb-3" max-width="150" min-width="135" class="text-center" v-bind="props" min-height="180" >
                                <v-img class=friendsAvatar :src="getUserAvatar(person.avatar)"></v-img>
                                <v-card-item density="compact" class="friend_name" style="font-size: 75%;">
                                    {{ person.firstName + ' ' + person.lastName}}
                                </v-card-item>
                                <v-overlay :model-value="isHovering" contained scrim="#036358">
                                    <v-btn variant="flat" size="x-small" 
                                    @click="returnUserId(person.id)">Profil megtekintése</v-btn>
                                </v-overlay>
                            </v-card>
                        </v-hover>
                    </v-col>
                </v-row>
                <v-row>
                    <RouterLink to="/searchPeople" @click="getAllFriends()">Több...</RouterLink>
                </v-row>

            </div>
        </div>
    </v-container>
</template>

<script>
import { getUserAvatar } from '@/utils/common';
import eventBus from '@/stores/eventBus';
import fetchData from '@/stores/server_routes.js'
import UserStore from '@/stores/UserStore';

export default {
    props: {
        friends: Object,
    },
    data() {
        return {
            getUserAvatar,

        }
    },
    methods: {
        returnUserId(id) {
            this.$emit('loadUserData', id); //return the id to parent
        },
        async getAllFriends() {
            let currentPage = 1;
            let totalItems = 50;
            var friends = await fetchData.methods.fetchData('GET', 'GetFriends', null, UserStore.getters.getUserId(), currentPage, totalItems);
            eventBus.emit('getAllFriends', friends);
        }
    }
}
</script>

<style>
.friendsAvatar{
    width: 100%;
    height: fit-content;
    min-width: 100%;

}

.friend_name {
    padding: 2px;
    display: flex;
    justify-content: center;
}
</style>