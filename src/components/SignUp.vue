
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
                            <v-col cols="8">
                                <v-title>Gender*</v-title>
                                <v-radio-group v-model="isMale" inline >
                                    <v-radio label="Female" value="false"></v-radio>
                                    <v-radio label="Male" value="true"></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="3">
                                <v-select :items="state.year" label="Year*" required 
                                v-model="selectedYear"
                                :rules="yearRuless"></v-select>
                            </v-col>
                            <v-col sm="3">
                                <v-select :items="state.month" v-model="selectedMonth" label="Month*" required :rules="monthRuless"></v-select>
                            </v-col>
                            <v-col sm="3">
                                <v-select :items="state.day" label="Day*" 
                                v-model="selectedDay"
                                required :rules="dayRuless"></v-select>
                            </v-col>
                            <v-col cols="8" sm="6" md="4">
                                <v-text-field label="Place of birth" required v-model='state.PlaceOfBirth'
                                    :rules="cityRuless"></v-text-field>
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
import { onMounted, ref } from 'vue';
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { fetchData } from "../stores/server_routes";

var state = ref(null);
const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedDay = ref(null);

export default {

    setup() {
        const initialState = {
            first_name: '',
            middle_name: '',
            last_name: '',
            PlaceOfBirth: '',
            email: '',
            password: '',
            year: [],
            month: [],
            day: [],
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
        ],
        selectedYear, 
        selectedMonth, 
        selectedDay,
        isMale: false
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
            var formatDate =  selectedYear.value + "-" + 7 + "-" + selectedDay.value;
            var data = {
                firstName: state.first_name,
                middleName: state.middle_name,
                lastName: state.last_name,
                email: state.email,
                password: state.password,
                birthDay: formatDate,
                PlaceOfBirth: state.PlaceOfBirth,
                isMale: this.isMale
            }

            if (this.state.first_name.length >= 3 ||
                this.last_name.length >= 3 ||
                this.email.length >= 3) 
            {
                try {
                    console.log(formatDate)
                    const response = await fetchData('register', data);
                    console.log(response)
                } catch (error) {
                    console.log(error);
                }
            } 
        }
    }
}
</script>