<template>
    <v-container v-if="true">
        <div>
            <div><img src="src/assets/imgs/blank_profile_pic.png" style="width:200px" /></div>
            <h2>Gipsz Jakab</h2>
            <h3>Szeged</h3>
        </div>
        <div>
            <v-row>
                <v-col>
                    col 1
                </v-col>
                <v-col>
                    <text-area-with-button />
                </v-col>
                <v-col>
                    col 3
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import TextAreaWithButton from '/src/components/TextAreaWithButton.vue';

//personal profile
var loggedIn = true;

export default {
    components: {
        'text-area-with-button': TextAreaWithButton,
    },
    data() {
        return {

        };
    },
};
</script>