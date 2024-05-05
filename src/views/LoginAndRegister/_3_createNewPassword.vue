<template>
    <v-card class="pa-2 bg-transparent px-12">
        <h4 class="text-center">
            Új jelszó megadása
        </h4>
        <div class="px-12 mx-auto w-50">
                <v-text-field
                    v-model="password1" 
                    autocomplete="new-password"
                    :type="showPw ? 'text' : 'password'" 
                    
                    :append-inner-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPw = !showPw"
                    density="compact"
                    @keyup="userTypes()"
                    >
                </v-text-field>
                <v-text-field 
                v-model="password2" 
                type="password"
                autocomplete="new-password"
                density="compact"
                >
                </v-text-field>
        </div>
        <!-- !passwordIsValid() -->
        <div v-if=" !passwordIsValid() && !isTyping"
        style="font-size: 12px;">
        A jelszónak 8-32 karakter hosszúnak kell lennie, és minimum 1 kisbetűt és 1 nagybetűt kell tartalmaznia
        </div>
        <div  class="text-right">
            <v-btn
                :disabled="
                passwordIsValid()
                ? false : true"
                @click="changePass()"
            >
                Módosítom a jelszavam.
            </v-btn>
        </div>
    </v-card>
</template>

<script>
import path_store from '@/stores/config.js';
import {BASE_URL} from '@/stores/server_routes.js';
import $ from 'jquery';


export default {
    props: {
        otpkey: String
    },
    emits: ['pwModify'],
    data() {
        return {
            showPw: false,
            isTyping: false,
            
            password1: '',
            password2: '',
            
        }
    },
    methods: {
        changePass() {
            if (this.passwordIsValid()) {
                this.PostPassword().catch(function (resp) {
                    if (resp) this.$emit('pwModify', resp == true ? true : false)
                });
            }
        },

        passwordIsValid() {
            var pwCorrect = this.password1 === this.password2 && 
            this.password1.length >= 8 && this.password1.length <= 32 &&
            this.password2.length >= 8 && this.password2.length <= 32 &&
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(this.password1) && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(this.password2);
            
            return pwCorrect;
        },
        
        passwordHaveBeenChanged() {
            setTimeout(() => { //Show overlay and load page
                UserStore.commit('setOverlayLoading', false);
                router.push({name: 'login'});
            }, 2000);
            UserStore.commit('setOverlayLoading', true)
        },

        PostPassword() {

            var data = {
                Password1: this.password1, 
                Password2: this.password2,
                otpKey: this.otpkey
            };
            console.log("sent data: " + data.otpKey);

            let path = `${BASE_URL}${path_store.getters.getServerRoute('ModifyPw')}`;
            try {
                return new Promise ((reject, resolve) => {
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        url: path,
                        type: 'POST',
                        data: JSON.stringify(data),
                        statusCode: {
                            200: function () {
                                // Sikeres kérés, kezelheted a státuszkódot
                                console.log("Sikeres kérés");
                                resolve(true);
                            },
                            400: function () {
                                // A kérés hibás volt, kezelheted a státuszkódot
                                console.log("Hibás kérés");
                                reject(false);
                            },
                            404: function () {
                                // Nem található a kérési erőforrás
                                console.log("A kérési erőforrás nem található");
                                reject(false);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            // Hiba esetén
                            console.log("Hiba: " + errorThrown);
                            //reject(false);
                        }
                        
                    });
                
                });
                
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        },
        

        userTypes() {
            this.handleTyping();          
        },

        handleTyping() {
            this.isTyping = true;
            this.lastKeyPressTime = Date.now();

            // Ellenőrizzük, hogy az utolsó gépelés óta eltelt-e legalább 3 másodperc
            setTimeout(() => {
            if (Date.now() - this.lastKeyPressTime >= 3000) {
                // Ha eltelt legalább 3 másodperc, akkor hajtsd végre az eseményt vagy a műveletet
                console.log(this.isTyping)
                this.isTyping = false;
            }
            }, 3000);
        },
    },
}
</script>