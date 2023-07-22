<template v-slot:activator="{ props }">
    <v-btn class="ml-2" color="primary" v-bind="props" @click="login()" to="/logIn">
        Sign Up
    </v-btn>
</template>


<script>
import $ from 'jquery';
export default{
    methods: {
        login() {

            console.log("logging in");
        }
    }
}
</script>