<template>
    <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
            <v-card ref="form">
                <v-card-text>
                    <v-text-field ref="email" v-model="email" 
                    :rules="[() => !!email || 'This field is required', //Email validation
                    () => !email || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'E-mail must be valid'
                ]"
                        :error-messages="errorMessages" label="Email address" placeholder="example123@email.com" required />

                    <v-text-field ref="password" v-model="password" 
                    :rules="[() => !!password || 'This field is required', //Password validation
                    () => password.length > 5 || 'Minimum 6 character required'
                    ]" label="Password" type="password" required :error-messages="errorMessages" />
                </v-card-text>
                <div class="loginMsg" id="errorMsg"></div>
                <v-divider class="mt-12"></v-divider>
                <v-card-actions>
                    <v-tooltip v-if="formHasErrors" location="left">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon class="my-0" v-bind="attrs" @click="resetForm" v-on="on">
                                <v-icon>mdi-refresh</v-icon>
                            </v-btn>
                        </template>
                        <span>Refresh form</span>
                    </v-tooltip>
                    <v-btn color="primary" variant="text" @click="login()">
                        Login
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>


<script>
import { loginUser } from '../utils/auth.js'

export default {
    data: () => ({
        email: '',
        password: '',
    }),
    methods: {
        login() {
            loginUser(this.email, this.password);
        }
    }
}
</script>

<style>
.loginMsg {
    visibility : visible;
}
</style>