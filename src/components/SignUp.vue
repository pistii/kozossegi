<script setup>
var currentDate = new Date();
console.log(currentDate.getFullYear());
console.log(currentDate.getMonth()+1);
console.log(currentDate.getDate());


var year = ref([]);
var month = ref([]);
var day = ref([]);
for (let da = 1; da <= 30; da++) {
    day.value.push(da);
}
var monthNames = ref(["Január", "Február", "Március", "Április", "Május", "Június", "Július"])
for (let m = 1; m < 13; m++) {
    month.value.push(m)
}
for (let y = currentDate.getFullYear(); y > currentDate.getFullYear()-90; y--) {
    year.value.push(y)
}
</script>
<template>
        <v-dialog v-model="dialog" persistent width="768">
            <template v-slot:activator="{ props }">
                <v-btn class="ml-2" color="primary" v-bind="props">
                    Sign Up
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="text-h5"></span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="8" sm="6" md="4">
                                <v-text-field label="First Name*" required v-model="first_name"></v-text-field>
                            </v-col>
                            <v-col cols="8" sm="6" md="4">
                                <v-text-field label="Middle name"
                                    hint="example of helper text only on focus" v-model="middle_name"></v-text-field>
                            </v-col>
                            <v-col cols="8" sm="6" md="4">
                                <v-text-field label="Last name*" hint="example of persistent helper text"
                                    persistent-hint required v-model='last_name'></v-text-field>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field label="Email*" required v-model="email"></v-text-field>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field label="Password*" type="password" required v-model="password"></v-text-field>
                            </v-col>
                        </v-row>
                            <v-row>
                            <v-col cols="8" sm="3">
                                <v-select :items="year" label="Year" required></v-select>
                            </v-col>
                            <v-col cols="8" sm="3">
                                <v-select :items="month" label="Month" required></v-select>
                            </v-col>
                            <v-col cols="4" sm="3">
                                <v-select :items="day" label="Day" required></v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                        Close
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="register">
                        Save
                    </v-btn>
                    <div v-if="showRes">
                        <v-alert :type="success" :value="dispMsg" dismissible>{{dispMessage}}</v-alert>
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>
</template>

<script>
import $ from "jquery";
import {ref} from 'vue';

export default {
    data: () => ({
        dialog: false,
        first_name : '',
        middle_name : '',
        last_name : '',
        email : '',
        password : '',
        birthday : '1234-01-01',

        dispMessage : '',
        showRes : false

        //TODO: BIRTHDAY 
    }),
    methods : {
        register() {
            var data = {
                firstName : this.first_name,
                middleName : this.middle_name,
                lastName : this.last_name,
                avatar : '',
                birthday : this.birthday,
                email : this.email,
                password : this.password,
                registrationDate : Date.now()
            }
            if (this.first_name.length >= 3 || 
            this.last_name.length >= 3 || 
            this.email.length >= 3) {
                $.postJSON('http://localhost:5000/users', data, this.showResult());
            } else {
                this.dispMessage = "You forgot to fill the Name and Email fields"
                this.showRes = true;
            }
        },
        showResult() {
            this.showRes = true;
            this.dispMessage = "Success";
        }
    }
}

//Need to accept the header from the backend
$.postJSON = function(url, data, callback) {
    return $.ajax({
    headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
    },
    'type': 'POST',
    'url': url,
    'data': JSON.stringify(data),
    'dataType': 'json',
    'success': callback
    });
};
</script>