<script setup>
import SignUp from './SignUp.vue';
</script>


<template>
    <v-container class="bg-surface-variant">
        <v-row class="justify-end">
            <v-text-field >
                <div class="keresbtn">
                <v-btn >Keres</v-btn>
            </div>
            </v-text-field>
            <SignUp/>
            
            <v-btn class="ml-2" color="primary" v-bind="props" to="/login">
                Sign In
            </v-btn>
        </v-row>
  </v-container>
</template>

<style>
.keresbtn {
    justify-content: right;
    text-align: right;
}
</style>