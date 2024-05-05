<template>
    <overlay-loading msg=""/>
    <v-container class="fill-height"
        fluid >
        <v-row  align="center" no-gutters
          justify="center">
            <v-col cols="auto" sm="12" md="10" lg="8">
                <v-card  class="signInContainer pa-6">
                    <Transition name="slide-fade">
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
                            <login @forgotPw="forgotPw" />
                        </div>
                    </Transition>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import OverlayLoadingComponent from '@/components/OverlayLoadingComponent.vue';
import sendToEmail from './_1_sendToEmail.vue';
import sendOTP from './_2_sendOTP.vue';
import createNewPassword from '@/views/LoginAndRegister/_3_createNewPassword.vue';
import login from './Login.vue';
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
        login,
    },
    data: () => ({
        forgotPassword: false,
        isVercodeSent: false,
        createNewPasswordView: false,
        
        email: '',
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