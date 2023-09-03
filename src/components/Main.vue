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


        </v-col>
        <v-row class="container">

            <v-img src="/src/assets/imgs/brandName.png"></v-img>
            <v-col cols="1">
                <v-btn class="ml-2 mb-2" color="primary" v-bind="props" to="/login">
                    Sign In
                </v-btn>
                <SignUp />
            </v-col>
        </v-row>

    </v-container>
</template>

<style></style>

