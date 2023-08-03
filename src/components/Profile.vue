<template>
    <v-container v-if="true" class="v-container">
        <div>
            <div><img src="src/assets/imgs/blank_profile_pic.png" style="width:200px" /></div>
            <h2>Gipsz Jakab</h2>
            <h3>Szeged</h3>
        </div>
        <div>
            <v-row>
                <v-col>
                    <text-area-with-button />
                    <center-content></center-content>
                </v-col>
                <v-col cols="3" style="background-color: aqua; width:auto; height: auto" >
                    col 2
                    <div >
dssd
                    </div>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import TextAreaWithButton from '/src/components/TextAreaWithButton.vue';
import CenterContent from '/src/assets/imgs/CenterContent.vue';
//personal profile
var loggedIn = true;

export default {
    components: {
        'text-area-with-button': TextAreaWithButton,
        'center-content' : CenterContent,
    },
    data() {
        return {

        };
    },
};
</script>

<style>
.v-container {
    padding-right: 1px;
    margin-right: 1px;
    margin-left: 50px;
}
</style>