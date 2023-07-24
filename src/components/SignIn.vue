<template>
    <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
            <v-card ref="form">
                <v-card-text>
                    <v-text-field ref="email" v-model="email" 
                    :rules="[() => !!email || 'This field is required', //Email validation
                    // () => !email || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'E-mail must be valid'
                ]"
                        :error-messages="errorMessages" label="Email address" placeholder="example123@email.com" required />

                    <v-text-field ref="password" v-model="password" 
                    :rules="[() => !!password || 'This field is required', //Password validation
                    //() => password.length > 5 || 'Minimum 6 character required'
                    ]" label="Password" type="password" required :error-messages="errorMessages" />
                </v-card-text>
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
import $ from 'jquery';
export default {
    data: () => ({
        email: '',
        password: '',
    }),
    methods: {
        login() {
            var data = {email : this.email, password : this.password};
            $.postJSON('http://localhost:5000/personal', data, console.log("success"));
        }
    }
}

$.postJSON = function(url, data, callback) {
    return $.ajax({
    headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
    },
    statusCode: {
        500: function(xhr) {
            console.log(xhr.responseText);
        },
        404: function(xhr) {
            alert("email or password doesn't exist")
        }
    },
    'type': 'POST',
    'url': url,
    'data': JSON.stringify(data),
    'dataType': 'json',
    'success': callback
    });
};
</script>