<script setup>
import SignUp from './SignUp.vue';
</script>


<template>
    <v-container class="bg-surface-variant">

        <v-row class="searchbarContainer">
            <v-text-field class="textfield1">

            </v-text-field>
            <v-btn>Keres</v-btn>
        </v-row>
        <v-row>

        </v-row>
    </v-container>

    <SignUp />

    <v-btn class="ml-2" color="primary" v-bind="props" to="/login">
        Sign In
    </v-btn>
</template>

<style>
.searchbarContainer {
    position: absolute;
}

.keresbtn {
    justify-content: right;
    text-align: right;
    position: relative;
}

.textfield1 {
    width: 100%;
}
</style>