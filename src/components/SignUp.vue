
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
                    <v-form ref="form">
                        <v-row>
                            <v-col cols="8" sm="6" md="4">
                                <v-text-field label="First Name*" required v-model="state.first_name"
                                    :rules="nameRuless"></v-text-field>
                            </v-col>
                            <v-col cols="8" sm="6" md="4">
                                <v-text-field label="Middle name" hint="example of helper text only on focus"
                                    v-model="state.middle_name"></v-text-field>
                            </v-col>
                            <v-col cols="8" sm="6" md="4">
                                <v-text-field label="Last name*" required v-model='state.last_name'
                                    :rules="nameRuless"></v-text-field>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field label="Email*" required v-model="state.email"
                                    :rules="emailRuless"></v-text-field>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field label="Password*" type="password" required v-model="state.password"
                                    :rules="passwordRuless"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="3">
                                <v-select :items="state.year" label="Year*" required :rules="yearRuless"></v-select>
                            </v-col>
                            <v-col sm="3">
                                <v-select :items="state.month" label="Month*" required :rules="monthRuless"></v-select>
                            </v-col>
                            <v-col sm="3">
                                <v-select :items="state.day" label="Day*" required :rules="dayRuless"></v-select>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-container>
                <small>*indicates required field</small>
                <v-sheet>
                    Already have an account?<RouterLink to="login"> Log In</RouterLink>
                </v-sheet>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                    Close
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="validate" @click.prevent="register">
                    Sign Up
                </v-btn>
                <div v-if="showRes">
                    <v-alert :type="success" :value="dispMsg" dismissible>{{ dispMessage }}</v-alert>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import $ from "jquery";
import { onMounted, ref } from 'vue';
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { BASE_URL, fetchData } from "../stores/server_routes";

var state = ref(null);


export default {

    setup() {
        const dateNow = new Date();
        const initialState = {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            password: '',
            year: [],
            month: [],
            day: []
        }

        state = reactive({
            ...initialState,
        })
        onMounted(() => {
            

            const rules = {
                first_name: { required },
                middle_name: { required },
                last_name: { required },
                email: { required, email },
                password: { required },
                year: { required },
                month: { required },
                day: { required }
            }
        
            const v$ = useVuelidate(rules, state)

            function clear() {
                v$.value.$reset()
                for (const [key, value] of Object.entries(initialState)) {
                    state[key] = value
                }
            }

            var currentDate = new Date();
            var monthNames = ref(["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"])

            for (let d = 1; d <= 30; d++) {
                state.day.push(d);
            }
            for (const [key, value] of Object.entries(monthNames.value)) {
                state.month.push(value)
            }
            for (let y = currentDate.getFullYear(); y > currentDate.getFullYear() - 90; y--) {
                state.year.push(y)
            }
        })
    },
    data: () => ({
        dialog: false,
        dispMessage: '',
        state,
        nameRules: [
            v => !!v || "Name is required",
            v => v.length > 3 || "Name field must be minimum 3 characters"
        ],
        emailRules: [
            v => !!v || "Email is required",
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Invalid email format",
            v => v.length > 5 || "Email must be minimum 6 characters"
        ],
        passwordRules: [
            v => !!v || "Password is required",
            v => v.length > 7 || "Password must be minimum 8 characters"
        ],
        yearRules: [
            v => !!v || "Year is required",
            v => v < dateNow.getFullYear() - 9 || "Invalid year"
        ],
        monthRules: [
            v => !!v || "Month is required",
        ],
        dayRules: [
            v => !!v || "Day is required",
        ]
    }),
    methods: {
        async validate() {
            const { valid } = await this.$refs.form.validate()

            if (valid) {
                this.register();
            }
        },
        async register() {
            var f = this.$refs.form.value
            var data = {
                first_name: state.first_name,
                middle_name: state.middle_name,
                last_name: state.last_name,
                email: state.email,
                password: state.password,
                dateOfBirth: Date.parse(state.year, state.month, state.day),
                registrationDate: Date.now()
            }

            if (this.state.first_name.length >= 3 ||
                this.last_name.length >= 3 ||
                this.email.length >= 3) 
            {
                try {
                    const response = await fetchData('register', JSON.stringify(data));
                    console.log(response)
                } catch (error) {
                    console.log(error);
                }
            } 
        }
    }
}
</script>