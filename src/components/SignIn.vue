<template>
    <overlay-loading />
    <v-container class="fill-height"
        fluid >
        <v-row  align="center" no-gutters
          justify="center">
            <v-col cols="auto" sm="12" md="10" lg="8">
                <v-card  class="signInContainer pa-6">
                    <Transition name="slide-fade">
                        <div v-if="forgotPassword"> <!--forgotPassword-->
                            <v-icon @click="forgotPassword = false">mdi-arrow-left</v-icon>

                            <v-col fill-height align="center">
                                <v-row class="justify-center pt-16">  <!--Todo: make it more response. The pt is static-->
                                    <div>Email:</div>
                                </v-row>
                                <v-row fill-height align="center">
                                    <v-text-field v-model="email"
                                        :rules="[() => !!email || 'This field is required',
                                            () => !email || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'E-mail must be valid']"
                                        class="mx-13 pt-3"
                                    >
                                    </v-text-field>
                                </v-row>
                                <v-card-actions class="forgotPwBtn">
                                    <v-btn color="blue-darken-2" variant="elevated" @click="sendForgottenPw()">
                                        Kérem a jelszóemlékeztetőt!
                                    </v-btn>
                                </v-card-actions>
                            </v-col>
                        </div>

                        <div v-else-if="isEmailHaveBeenSent"> <!--isEmailHaveBeenSent--> 
                                <v-icon @click="forgotPassword = false">mdi-arrow-left</v-icon>

                                <v-col fill-height align="center"> <!--TODO: 3 mistakes then restrict the account, check the ip address -->
                                    <v-row class="justify-center pt-16">  <!--Todo: make it more response. The pt is static.-->
                                        <div>Visszaállító kód:</div>
                                    </v-row>
                                    <v-row fill-height align="center">
                                        <v-text-field 
                                        v-model="verCode"
                                        @change="isLenSix"
                                        >
                                        </v-text-field>
                                    </v-row>
                                </v-col>
                            </div>

                        <div v-else> 
                            <v-card-text class="ma-6">
                                <v-text-field 
                                ref="email" 
                                v-model="email" 
                                :rules="[() => !!email || 'This field is required', //Email validation
                                () => !email || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'E-mail must be valid']"
                                label="Email address" placeholder="example123@email.com" required />

                                <v-text-field ref="password" v-model="password" 
                                :rules="[() => !!password || 'This field is required', //Password validation
                                () => password.length > 5 || 'Minimum 6 character required'
                                ]" label="Password" 
                                :type="showPw ? 'text' : 'password'" 
                                required 
                                :append-inner-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="showPw = !showPw"
                                />
                            </v-card-text>
                            <v-card class="text-center mx-16 bg-blue-lighten-2" v-if="notFound">
                            <v-icon class="bg-red" style="border-radius: 50%;">mdi-exclamation</v-icon>
                                <div>
                                    Hibás email vagy jelszó.
                                </div>
                            </v-card>
                            <v-divider class="mt-12"></v-divider>
                            <v-card-actions class="justify-space-between">
                                <v-btn class="px-6" variant="text" @click="forgotPassword = true">
                                    Elfelejtettem a jelszavam!
                                </v-btn>
                                    <v-btn color="green" variant="elevated" @click="login()">
                                    Login
                                </v-btn>
                            </v-card-actions>

                        </div>
                    </Transition>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import { loginUser } from '../utils/auth.js'
import { loginSetup } from '../utils/setup';
import fetchData from '@/stores/server_routes.js';
import {encryptionData} from '@/utils/encryptionData.js'
import {decrypt} from '@/utils/decryptionData.js'
import OverlayLoadingComponent from '@/components/OverlayLoadingComponent.vue';

import UserStore from '../stores/UserStore';
/*
Forgot password reset steps: 
1. sends the otp for the email, triggers the sendForgottenPw method.
2. user receives the OTP into the mailbox and inserts in to the box. Automatically triggers when the length reaches the lengthOfVerCode variable, and sends the OTP towards the server.
3. The server checks the validity of the verification code and if it is valid, returns the previously sent encrypted OTP key data.
4. If both (sent and received) of the data equals, navigates in to the account.
5. After logged in, the user will be requested to change the password. 
*/
//TODO: do not forward the user into the account, also implement the new password requirement here
export default {
    components: {
        'overlay-loading': OverlayLoadingComponent,
    },
    data: () => ({
        email: 'firstTest@gmail.com', //TODO
        password: '',
        showPw: false,
        notFound: false,
        forgotPassword: false,
        isVercodeSent: false,

        verCode: 0,
        lengthOfVerCode: 6,
        tries: 0, maxTries: 3,

    }),
    computed: {
        isEmailHaveBeenSent() {
            return this.isVercodeSent;
        },

        isLenSix() {
            if (this.verCode.length === this.lengthOfVerCode) {
                this.sendOTPKey();
            }
        },
    },
    methods: {
        async login() {
            this.notFound = false;
            console.log("trying to login..." + this.email, this.password);
            await loginUser(this.email, this.password)
                .then(resp => this.throwConnectionResult(resp))
                .catch(error => error === "Not Found" ? this.notFound = true : this.notFound = false)
            
        },
        throwConnectionResult(response, status) {
            console.log(response);
            if (response) {
                loginSetup();
            }
            else {
                console.log("Not found")
            }
        },
        async sendForgottenPw() {
            if (this.email.length>0) {
                var data = await encryptionData(this.email, "I love chocolate"); //128bit
                await fetchData.methods.fetchData('POST', 'forgotPw', data )
                .then(resp => { 
                    this.decryptData(resp) !== "123456" ? 
                    this.emailSent() : 
                    this.isVercodeSent = false; 
                    console.log(decrypt(resp, "I love chocolate")) //Látszólag nem csinál semmit ha helytelen az email cím -> Ez így helyes, nem lesz visszajelzés a felhasználó számára a biztonsági kockázatok csökkentése miatt
                });
            }
        },
        emailSent () { //Just notifies the frontend to change
            this.isVercodeSent = true;
            this.forgotPassword = false;
        },

        async sendOTPKey() { //TODO: add here the tries
            var encrypted = await encryptionData(this.verCode, "I love chocolateI love chocolate"); //256 bit
            //"Roses are red, the sky is blue, here's the salt, generated for You");
            await fetchData.methods.fetchData('POST', 'checkOTP', encrypted)
                .then(resp => {
                    if (JSON.stringify(resp.data) === JSON.stringify(encrypted.data)) {
                        this.password = this.verCode;
                        UserStore.commit('setPasswordModifyDialog', true);
                        setTimeout(() => {
                            UserStore.commit('setOverlayLoading', false);
                            this.login();
                        }, 2000);
                        UserStore.commit('setOverlayLoading', true)
                    }
                });
        },

        decryptData(resp) {
            var pw = decrypt(resp, "I love chocolate"); 
            this.password = pw;
            this.incrementTries();
        },

        incrementTries() {
            this.incrementTries ++;
            if (this.incrementTries >= this.maxTries) this.restrictAccess();
        },

        restrictAccess() { //Todo: Implemented with rate limiting middleware on the backend
            console.log("should restrict on more tries.");
        }
    }
}

</script>

<style>
.signInContainer {
    border: 3px solid rgb(89, 126, 160);
    background-color: rgba(99, 132, 160, 0.458);
    min-height: 400px;
    min-width: 300px;
}

.forgotPwBtn {
    position: absolute; 
    bottom: 0;
    right: 0;
    padding: 25px;
}

.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(200px);
  opacity: 0;
}

</style>