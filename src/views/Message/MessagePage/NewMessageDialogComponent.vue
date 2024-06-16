<template>
    <v-btn rounded="xl" color="deep-purple-accent-2" @click="loadData()">
        <v-icon start icon="mdi-plus">
        </v-icon>
        Új üzenet
    </v-btn>
    <v-dialog  
    persistent 
    v-model="newMessageDialog" 
    width="auto">
        <v-card >
            <div class="text-right" >
                <v-icon class="onHover" @click="newMessageDialog = false">
                    mdi-close-circle-outline
                </v-icon>
            </div>
            <v-list-subheader>Ismerősök</v-list-subheader>
            <v-text-field 
            placeholder="Start typing..."
            v-model="searchText"
            ></v-text-field>
            <v-virtual-scroll
            :items="filteredFriends"
            height="320"
            width="400"
            >
                <template v-slot:default="{ item }">
                    <v-list-item 
                    :value="item" 
                    color="primary" 
                    :prepend-avatar="item.avatar" 
                    @click="sendMessageToUser(item)">
                        <v-list-item-title>{{ item.firstName + " " + item.lastName }}</v-list-item-title>
                    </v-list-item>
                </template>
            </v-virtual-scroll>

            <v-card-actions>
                <v-btn color="primary" block @click="newMessageDialog = false">Close Dialog</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import fetchData from '@/stores/server_routes.js';
import { ref } from 'vue';
import UserStore from '@/stores/UserStore';


var friends = ref([]);

export default {
    emits: ['sendToUser'],
    computed: {
        filteredFriends() {
        // Szűrés az aktuális keresési szöveg alapján
        const searchLowerCase = this.searchText.toLowerCase();
        let filteredFriends = friends.value[0];
        console.log(filteredFriends)
        if (friends.value.length>0) {
            filteredFriends.filter((friend) =>
                friend.firstName.toLowerCase().includes(searchLowerCase) ||
                friend.lastName.toLowerCase().includes(searchLowerCase)
            );
            return filteredFriends;
        }
        },
    },
    data() {
        return {
            newMessageDialog: false,
            friends,
            searchText: "",
        }
    },
    methods: {
        loadData() {
            //console.log(friends.value)
            this.newMessageDialog = true;
            if (friends.value.length === 0) {
                //fetchData.methods.fetchData('GetMessageFriends', 100) //TODO: egyelőre 100 barátot kérdez le, és nem kell az egész barát lista tartalmát visszadni.
                fetchData.methods.fetchData('GET', 'GetMessageFriends', null, UserStore.getters.getUserId(), 1, 100)
                .then(resp => friends.value.push(resp));

                //console.log(friends.value)
            }
        },
        sendMessageToUser(user) {
            this.$emit('sendToUser', user);
            this.newMessageDialog = false;
        }
    }
}
</script>