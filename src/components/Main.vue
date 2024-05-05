<template>
    <Welcome />
    <!-- <v-container class="fill-height"
        fluid>
        <v-row  align="center"
          justify="center">
            <v-col >
                <v-img src="/src/assets/brand.gif"></v-img>
            </v-col>
            <v-col cols="1">
                <v-btn class="ml-2 mb-2" color="primary" to="/login">
                    Sign In
                </v-btn>
                
                <v-btn  class="ml-2" color="primary" to="/register">
                    Sign Up
                </v-btn>
            </v-col>
        </v-row>
    </v-container> -->
</template>

<script>
import SignUp from '@/views/LoginAndRegister/SignUp.vue';
import Welcome from './Welcome.vue';
export default {
    components: {
        SignUp,
        Welcome,

    },
    data() {
        return {
            items: this.items
        }
    }
}
</script>
