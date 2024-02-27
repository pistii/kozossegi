<template>
    
    <v-container>
        <v-card fluid class="bg-transparent elevation-0">
            <v-card-text class="text-center">
                <div v-if="status == 200" class="text-green">
                    <v-progress-linear
                    indeterminate
                    color="orange-darken-4"
                    class="my-4"
                    ></v-progress-linear>
                    <h4>Sikeres regisztráció.</h4>
                    <div>
                        <p>Most át leszel irányítva a kezdőoldalra.</p>
                    </div>
                </div>
                <div v-else class="text-red">
                    <v-icon size="50" >mdi-alert</v-icon>
                    <h4 v-if="status == 404">Ezen a linken keresztül már van aktivált felhasználó.</h4>
                    <h4 v-else>Hibás a link paramétere, vagy túl sok idő telt el a regisztráció óta.</h4>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import $ from 'jquery'
import { BASE_URL } from '@/stores/server_routes.js'
import { loginUser } from '../utils/auth';
let status = ref(null);
let loadingLogin = ref(false);

onMounted(() => {
    const route = useRoute()
    let token = route.params.token
    validateUser(token).then(resp => slowDownLogin(resp));
})

const validateUser = async (token) => {
    
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token 
    }
    
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: headers,
            url: BASE_URL + 'api/users/Validate',
            type: 'GET',
            statusCode: {
                200: function () {
                    console.log("Sikeres validálás");
                    status.value = 200;
                },
                404: function () {
                    console.log("Már aktivált user");
                    status.value = 404;
                },
                400: function () {
                    console.log("Valószínűleg hibás a token...");
                    status.value = 400;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 500) {
                    // Érvénytelen token esetén történő kezelés
                    console.error('Érvénytelen token');
                } else {
                    // Egyéb hiba esetén történő kezelés
                    console.error('Hiba történt a token validálása során, valószínűleg lejárt, vagy módosítva lett:', textStatus, errorThrown);
                }
            },
            success: function (responseData, textStatus, jqXHR) {
                resolve(responseData);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown, 'status: ' + textStatus, "errorThrown: " + errorThrown);
                reject(textStatus, jqXHR.status, errorThrown);
            },
        });
    });
}

async function slowDownLogin(resp) {
    setTimeout(() => {
        loadingLogin.value = true;
        loginUser(resp.email, resp.password)
    }, 2000);
}

</script>