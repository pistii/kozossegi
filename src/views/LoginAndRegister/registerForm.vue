<template>
    <v-form ref="form" class="mt-4">
        <v-row no-gutters>
            <v-col cols="12" sm="6" md="4">
                <v-text-field label="First Name*" required v-model="state.first_name" density="compact"
                    :rules="nameRules"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-text-field label="Middle name" density="compact" v-model="state.middle_name"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-text-field label="Last name*" required v-model='state.last_name' density="compact"
                    :rules="nameRules"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-text-field label="Email*" required v-model="state.email" density="compact"
                    :rules="emailRules"></v-text-field>
            </v-col>
            <v-col cols="8" sm="12">
                <v-text-field label="Password*" v-model="state.password" :rules="passwordRules"
                    :type="showPw ? 'text' : 'password'" required
                    :append-inner-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="showPw = !showPw"
                    density="compact"></v-text-field>
            </v-col>
            <v-col cols="12">
                <span class="px-2">Gender*</span>
                <v-radio-group v-model="isMale" required>
                    <v-radio label="Female" value="false"></v-radio>
                    <v-radio label="Male" value="true"></v-radio>
                </v-radio-group>
            </v-col>
            <v-row class="w-100 px-2 pb-6">
                <span class="px-2">Date of birth*</span>
            </v-row>
                <v-col cols="4" md="3" sm="3" class="mx-auto">
                    <v-select :items="state.year" label="Year*" v-model="selectedYear" required :rules="yearRules"
                        density="compact"></v-select>
                </v-col>
                <v-col cols="4" md="3" sm="3" class="mx-auto">
                    <v-select :items="state.month" label="Month*" v-model="selectedMonth" required :rules="monthRules"
                        density="compact"></v-select>
                </v-col>
                <v-col cols="3" md="3" sm="3" class="mx-auto">
                    <v-select :items="state.day" label="Day*" v-model="selectedDay" required :rules="dayRules"
                        density="compact"></v-select>
                </v-col>
            
            <v-col cols="12">
                <v-text-field label="Place of birth" v-model='state.PlaceOfBirth' density="compact"></v-text-field>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { onMounted, ref } from 'vue';
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import moment from 'moment';
import fetchData from "@/stores/server_routes";

var state = ref(null);
const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedDay = ref(null);
var monthNames = ref(["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"])
var currentDate = new Date();
var yearLimit = currentDate.getFullYear() - 9;

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

            for (let d = 1; d <= 30; d++) {
                state.day.push(d);
            }
            for (const [key, value] of Object.entries(monthNames.value)) {
                state.month.push(value)
            }
            for (let y = yearLimit; y > yearLimit - 90; y--) {
                state.year.push(y)
            }
        })
    },
    data: () => ({
        dispMessage: '',
        state,
        selectedYear,
        selectedMonth,
        selectedDay,
        currentDate,
        nameRules: [
            v => !!v || "Name is required",
            v => v.length > 3 || "Name field must be minimum 3 characters"
        ],
        emailRules: [
            v => !!v || "Email is required",
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Invalid email format",
            v => v.length > 5 || "Email must be minimum 6 characters long"
        ],
        passwordRules: [
            v => !!v || "Password is required",
            v => v.length > 7 || "Password must be minimum 8 characters long"
        ],
        yearRules: [
            v => !!v || "Year is required",
        ],
        monthRules: [
            v => !!v || "Month is required",
        ],
        dayRules: [
            v => !!v || "Day is required",
        ],
        isMale: false,
        showRes: false,
        showPw: false,
    }),
}
</script>