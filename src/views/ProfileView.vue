<template>
    <v-container>
        <div>
            <div>
                <img v-if="!item.avatar" src="/src/assets/imgs/blank_profile_pic.png" class="avatar" />
                <img v-else :src="item.avatar" class="avatar" />
            </div>
            <div v-if="isOwner">
                <input type="file" id="image_field">
                <input type="text" id="description">
                <input type="submit" id="submit" value="Submit" @click="uploadImage()">
            </div>
        </div>
        <div> 
            <h2> {{ item.firstName }} {{ item.middleName }} {{ item.lastName }}</h2>
            <h3> {{ item.birthOfPlace }}</h3>
            <v-row>
                <v-col cols="1">

                </v-col>
                <v-col cols="3" style="margin-right: 8%;">

                    <text-area-with-button />
                    <center-content></center-content>
                </v-col>
                <v-col cols="auto" style="background-color: transparent; width:auto; height: auto" lg="6" md="6" sm="6">
                    <div v-if="hasNoFriends">
                        Még nincsenek ismerőseid... <a href="./searchPeople">Keress embereket...</a>
                    </div>
                    <v-container  v-else>
                        <v-row no-gutters>
                            <v-col cols="4" xl="3" v-for="person in peopleArray" :key="person">
                                <v-card color="#c5e2f0" theme="dark" max-width="150" class="text-center ml-4 mb-4">
                                    <v-avatar size="130" rounded="3">
                                        <v-img src="/src/assets/imgs/blank_profile_pic.png" />
                                    </v-avatar>
                                    <v-card-action>
                                        <v-btn class='viewProfileBtn'>{{ person }}</v-btn>
                                    </v-card-action>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container>
                        <v-sheet>Fényképek</v-sheet>
                        <v-col>
                            <v-row>
                                <v-avatar size="120" rounded="3">
                                    <v-img src="/src/assets/imgs/blank_profile_pic.png" />
                                </v-avatar>
                                <v-avatar size="120" rounded="3">
                                    <v-img src="/src/assets/imgs/blank_profile_pic.png" />
                                </v-avatar>
                                <v-avatar size="120" rounded="3">
                                    <v-img src="/src/assets/imgs/blank_profile_pic.png" />
                                </v-avatar>
                            </v-row>
                        </v-col>
                    </v-container>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>


<script>
import TextAreaWithButton from '../components/TextAreaWithButton.vue';
import CenterContent from '/src/assets/imgs/CenterContent.vue';
import $ from 'jquery';
import { fetchData } from '../stores/server_routes.js';
import { useRoute, useRouter } from 'vue-router'
import {ref, onMounted, watch, computed} from 'vue'

//Todo: with authentication set the profile page if the user visits his/her own page
//load images, comments, posts, send posts, upload image, change profile picture, 
let item = ref({});
const isOwner = false; 

export default {
    setup() {
        const route = useRoute()
        const router = useRouter()
        onMounted(async () => {
            if (isOwner) {
                item.value = JSON.parse(localStorage.getItem('userInfo'));
            } else {
                await router.isReady()
                const response = await fetchData('GetUserById', route.params.id).then(value => item.value = value).catch((err) => console.log(err));
                item.value = response || {};
            }
        });
    },
    methods: {
        uploadImage() {
            var fileInput = document.getElementById('image_field');
            var file = fileInput.files[0];
            var formData = new FormData();
            formData.append('file', file);
            var description = $("input#description").val();
            formData.append('description', description);
            let Data = {
                "userId": 1,
                "img": [1, 2, 3, 4, 5],
                "token": "sdfgpj5345"
            };
            fetchData('uploadImage', JSON.stringify(Data))
        }
    },

    data() {
        return {
            hasNoFriends: false,
            item, 
            isOwner
        }
    },
    components: {
        'text-area-with-button': TextAreaWithButton,
        'center-content': CenterContent,
    }
}
</script>

<style>
.avatar {
    width: 200px;
}


.viewProfileBtn {
    font-size: 10px;
    padding: 0px;
    background-color: #57b9ea;
}
</style>