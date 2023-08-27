<template>
    <v-container v-if="true" class="v-container">
        <div>
            <div>
                <img v-if="response.avatar == null"  src="src/assets/imgs/blank_profile_pic.png" class="avatar" />
                <img v-else :src="response.avatar" class="avatar" />
            </div>
            <h2> {{ response.firstName }} {{ response.middleName }} {{ response.lastName }}</h2>
            <h3> {{ response.birthOfPlace }}</h3>
        </div>
        <div>
            <v-row>
                <v-col>
                    <text-area-with-button />
                    <center-content></center-content>
                </v-col>
                <v-col cols="3" style="background-color: aqua; width:auto; height: auto">
                    col 2
                    <div>
                        dssd
                    </div>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script setup>
import { BASE_URL } from '../stores/base.js';
import { ref, onMounted } from 'vue';
import $ from 'jquery';

const response = ref([]);

const userId = ref(143);
$.ajax({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    url: BASE_URL + "/api/personal/myProfile/" + userId.value,
    type: "get",
    success: function (data) {
        response.value = data
        response.value.avatar = "https://nickelodeonuniverse.com/wp-content/uploads/Spongebob.png"
        console.log(response.value)
    },
    error: function (data) {
        console.log("server not available");
    },
});
</script>
<script>
import TextAreaWithButton from '/src/components/TextAreaWithButton.vue';
import CenterContent from '/src/assets/imgs/CenterContent.vue';

var loggedIn = true;

export default {
    components: {
        'text-area-with-button': TextAreaWithButton,
        'center-content': CenterContent,
    }
}
</script>

<style>
.avatar {
    width:200px;
}

.v-container {
    padding-right: 1px;
    margin-right: 1px;
    margin-left: 50px;
}
</style>