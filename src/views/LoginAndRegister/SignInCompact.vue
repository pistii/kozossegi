<template>
    <overlay-loading msg=""/>
        <v-row  align="center" no-gutters
          justify="center">
            <v-col>
                <v-card  class="signInContainer pa-6">
                        <div v-if="forgotPassword">
                            <sendToEmail 
                            :email="email"
                            @forgotPassword="forgotPassword = false" 
                            @emailHaveBeenSent="this.isVercodeSent = true; this.forgotPassword = false;"/>
                        </div>

                        <div v-else-if="isVercodeSent"> <!--isEmailHaveBeenSent--> 
                            <sendOTP @navToNewPw="otpStepCompleted"/>
                        </div>

                        <div v-else-if="createNewPasswordView"> <!--createNewPasswordView-->
                            <create-new-password :otpkey="otpkey" @pwModify="stepsCompeted"/>
                        </div>

                        <div v-else> 
                            <v-card-text >
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
                                <v-btn 
                                class="px-2 pb-2 bg-grey-lighten-2" 
                                id="passwordResetBtn"
                                size="x-small" 
                                density="comfortable"
                                @click="forgotPwBtn()">
                                    Elfelejtettem a jelszavam!
                                </v-btn>
                            </v-card-text>
                            <v-card class="text-center mx-16 bg-blue-lighten-2" v-if="notFound">
                            <v-icon class="bg-red" style="border-radius: 50%;">mdi-exclamation</v-icon>
                                <div>
                                    Hibás email vagy jelszó.
                                </div>
                            </v-card>
                            <v-divider class="mt-6"></v-divider>
                            <v-card-actions class="justify-end">
                                <v-btn color="green" variant="elevated" @click="login()">
                                    Login
                                </v-btn>
                            </v-card-actions>
                        </div>
                </v-card>
            </v-col>
        </v-row>
</template>


<script>
import OverlayLoadingComponent from '@/components/OverlayLoadingComponent.vue';
import sendToEmail from './_1_sendToEmail.vue';
import sendOTP from './_2_sendOTP.vue';
import createNewPassword from '@/views/LoginAndRegister/_3_createNewPassword.vue';
import login from './Login.vue';
import { loginUser } from '@/utils/auth';

/*
Forgot password reset steps: 
1. sends the otp for the email, triggers the sendForgottenPw method.
2. user receives the OTP into the mailbox and inserts in to the box. Automatically triggers when the length reaches the lengthOfVerCode variable, and sends the OTP towards the server.
3. The server checks the validity of the verification code and if it is valid, returns the previously sent encrypted OTP key data.
4. If both (sent and received) of the data equals, navigates in to the account.
5. After logged in, the user will be requested to change the password. 
*/


export default {
    components: {
        'overlay-loading': OverlayLoadingComponent,
        'create-new-password': createNewPassword,
        sendToEmail,
        sendOTP,
        
    },
    data: () => ({
        forgotPassword: false,
        isVercodeSent: false,
        createNewPasswordView: false,
        showPw : false,

        email: '',
        password: '',
        notFound: false,
        otpkey: '',
    }),
    methods: {
        stepsCompeted(val) {
            console.log("completed: " + val)
            this.createNewPasswordView = false;
            this.forgotPassword = false;
        },
        otpStepCompleted(verCode) {
            this.isVercodeSent=false; 
            this.createNewPasswordView = true;
            this.otpkey = verCode;
        },
        forgotPw(email) {
            this.forgotPassword = true;
            this.email = email;
        },
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

    }
}

</script>

<style>
#passwordResetBtn {
    padding-inline: 0px;
}


.signInContainer {
    border: 3px solid rgb(89, 126, 160);
    background-color: rgba(99, 132, 160, 0.458);
    min-height: 400px;
    min-width: 300px;
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