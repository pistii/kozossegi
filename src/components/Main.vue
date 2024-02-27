<template>
    <v-container class="fill-height"
        fluid>
        <v-row  align="center"
          justify="center">
            <v-col cols="8" >
                <v-img src="/src/assets/imgs/brandName.png"></v-img>
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
    </v-container>
</template>

<script>
import SignUp from '/src/components/SignUp.vue';

export default {
    components: {
        SignUp,
    },
    data() {
        return {
            items: this.items
        }
    }
}
</script>
