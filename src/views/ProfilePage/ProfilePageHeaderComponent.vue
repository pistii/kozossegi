
<!--TODO/NOTE: if the -->
<template>
    <v-sheet class="ma-1 pa-3 mb-8" color="transparent" rounded="3" elevation="3">
        <div class="flex-wrap text-right" >
            <v-btn v-if="publicity == 'self'" color="primary" class="px-2 py-0 mt-0 no-uppercase" @click="modal = !modal">
                Profil beállítások
            </v-btn>
            <div v-else-if="publicity == 'friend'">
                <v-btn @click="removeUserFromFriends(user)">Törlés az ismerősök közül</v-btn>
            </div>
            <div v-else>
                <v-btn @click="addFriend(user)"  :text="friendRequestStatus[user.id] ?? 'Jelölés'" ></v-btn>
            </div>
        </div>
        
        <div>
            <img :src="getUserAvatar(getUser.avatar)" class="avatar" />
        </div>
        
        <div class="px-6 pa-3">
            <h2>{{getFullName(getUser.firstName, getUser.middleName, getUser.lastName)}}</h2>
            <h3> {{ user.birthOfPlace }}</h3>
        </div>
    </v-sheet>
    
    <v-dialog
      v-model="this.modal"
      width="800"
      persistent
    >
        <profile-settings @closeModal="closeModal()"></profile-settings>
    </v-dialog>
</template>

<script>
import ProfilePageSettingsComponent from './ProfilePageSettingsComponent.vue';
import { getUserAvatar, getFullName } from '../../utils/common'
import store from '@/stores/UserStore'
import fetchData from '@/stores/server_routes'
import {ref, reactive} from 'vue'
import { mapGetters } from 'vuex';

export default {
    props: {
        user: Object,
        publicity: String,

    },
    emits: ['removeFriend'],
    components: {
        'profile-settings' : ProfilePageSettingsComponent,
    },
    computed: {
        getUser() {
            return store.getters.getUser();
        }
    },
    data() {
        return {
            modal: false,
            getUserAvatar, getFullName,
            addFriend,
            friendRequestSent: false,
            friendRequestStatus: reactive({}),
        }
    },
    methods: {
        async removeUserFromFriends(user) {
            //console.log(user.id)
            var friendship = {
                UserId: store.getters.getUserId(),
                FriendId: user.id
            }
            var resp = await fetchData.methods.fetchData('DELETE', 'DeleteFriend', friendship);
            if (resp === "removed") {
                this.$emit('removeFriend');

            }
        }, 

        closeModal() {
            this.modal = false, this.$forceUpdate();
        }
        
    }
}

export async function addFriend(user) {
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
</script>