<template>
    <v-icon @click="goBack()">mdi-arrow-left</v-icon>
    
    <v-col fill-height align="center">
        <v-row class="justify-center pt-16">
            <div><b>Regisztrált/másodlagos email cím:</b></div>
        </v-row>
        <v-row fill-height align="center" class="mx-auto w-50">
            <v-text-field v-model="this.email"
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
</template>

<script>
import fetchData from '@/stores/server_routes.js';
import {encryptionData} from '@/utils/encryptionData.js'
import {decrypt} from '@/utils/decryptionData.js'
import eventBus from '@/stores/eventBus.js';

export default {
    props: {
        email: String
    },
    emits: ['forgotPassword', 'emailHaveBeenSent'],
    
    methods: {
        goBack() {
            this.$emit('forgotPassword');
        },
        async sendForgottenPw() {
            if (this.email.length>0) {
                var data = await encryptionData(this.email, "I love chocolate"); //128bit
                await fetchData.methods.fetchData('POST', 'forgotPw', data )
                .then(resp => { 
                    this.decryptData(resp) !== "123456" ? 
                    this.$emit('emailHaveBeenSent') : 
                    this.isVercodeSent = false; 
                    console.log(decrypt(resp, "I love chocolate")) //Látszólag nem csinál semmit ha helytelen az email cím -> Ez így helyes, nem lesz visszajelzés a felhasználó számára a biztonsági kockázatok csökkentése miatt
                });
            }
        },
        
        decryptData(resp) {
            var pw = decrypt(resp, "I love chocolate"); 
            this.password = pw;
        },
    },
}
</script>

<style scoped>
.forgotPwBtn {
    position: absolute; 
    bottom: 0;
    right: 0;
    padding: 25px;
}

</style>