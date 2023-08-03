<script>
import { RouterView } from 'vue-router'
import SignUp from '/src/components/SignUp.vue';

export default {
    components: {
        SignUp,
    }
}
</script>


<template>
    <v-container>
        <v-row>
        <SignUp />
        <v-btn class="ml-2" color="primary" v-bind="props" to="/login">
            Sign In
        </v-btn>
        </v-row>
        <RouterView/>
    </v-container>

</template>

<style>

</style>
