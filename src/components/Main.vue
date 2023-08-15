<script>
import { RouterView } from 'vue-router'
import SignUp from '/src/components/SignUp.vue';


export default {
    components: {
        SignUp,
    },
}
</script>


<template>
    <v-container>
        <v-col class="text-right">
            <v-btn class="ml-2" color="primary" v-bind="props" to="/login">
                Sign In
            </v-btn>

        </v-col>
        <v-row class="main_middle_container">
            <v-img src="/src/assets/imgs/brandName.png"></v-img>

            <SignUp />

        </v-row>

    </v-container>
</template>

<style></style>

