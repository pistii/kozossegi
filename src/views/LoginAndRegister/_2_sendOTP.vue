<template>
    <v-icon @click="goBack()">mdi-arrow-left</v-icon>
    <v-col fill-height align="center" class="mx-auto w-50"> <!--TODO: 3 mistakes then restrict the account, check the ip address -->
        <v-row class="justify-center pt-16 ">  <!--Todo: make it more response. The pt is static.-->
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
</template>

<script>
import fetchData from '@/stores/server_routes.js';
import {encryptionData} from '@/utils/encryptionData.js'
import {decrypt} from '@/utils/decryptionData.js'


export default {
    emits: ['forgotPassword', 'navToNewPw'],
    
    data() {
        return {
            verCode: 0,
            lengthOfVerCode: 6,
        }
    },
    computed: {
        isLenSix() {
            if (this.verCode.length === this.lengthOfVerCode) {
                this.sendOTPKey();
            }
        },
    },
    methods: {
        goBack() {
            this.$emit('forgotPassword');
        },
        async sendOTPKey() {
            var encrypted = await encryptionData(this.verCode, "I love chocolateI love chocolate"); //256 bit
            //"Roses are red, the sky is blue, here's the salt, generated for You");
            await fetchData.methods.fetchData('POST', 'checkOTP', encrypted)
                .then(resp => {
                    if (JSON.stringify(resp.data) === JSON.stringify(encrypted.data)) {
                        console.log("Vercode beállítva in _2_ : " + this.verCode)
                        this.$emit('navToNewPw', this.verCode);
                    }
                });
        },
    },
     
}
</script>