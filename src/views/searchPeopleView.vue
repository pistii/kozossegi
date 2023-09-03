<template>
    <v-container class="d-flex justify-center cc">
        <v-row>
            <v-col v-for="(_, n) in peopleArray" :key="n" cols="auto">
                <v-card class="mr-5 ml-5" color="#1b4e54" theme="dark" max-width="200" title="Gipsz Jakab"
                    :class="['justify-center align-center bg-secondary', `elevation-${x}`]">
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
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const peopleArray = ["Gipsz Jakab", "Gipsz Jakab","Gipsz Jakab","Gipsz Jakab","Gipsz Jakab","Gipsz Jakab","Gipsz Jakab",]
const x = 12
</script>

<style></style>