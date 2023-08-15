<template>
    <v-row no-gutters>
        <v-col />

        <v-container class="d-flex flex-wrap">
            <v-col cols="3" v-for="(users, index) in searchResult">
                <v-layout>
                <v-card color="#1b4e54" theme="dark" max-width="200" :title="users.firstName">
                        <v-avatar size="130" rounded="3">
                            <v-img src="src/assets/imgs/blank_profile_pic.png" />
                        </v-avatar>
                        <v-card-actions>
                            <v-btn>Jelölés</v-btn>
                        </v-card-actions>
                        <v-card-action>
                            <v-btn>Profil megtekintése</v-btn>
                        </v-card-action>
                    </v-card>
            </v-layout>
            </v-col>

        </v-container>
        <v-col />
    </v-row>
</template>

<script setup>
import { responseData } from '../assets/navBar.vue';

var searchResult = responseData;
console.log(searchResult)
</script>