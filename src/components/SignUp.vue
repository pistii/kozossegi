
<template>
    <v-container fluid class="fill-height">
        <v-col>
            <v-row class="justify-center">
                <v-card width="600" class="bg-blue-grey-lighten-5"  >
                    <v-container  :class="{'bg-cyan-lighten-4' : registeringPbar}" >
                    <v-card-title>
                        <span class="text-h5"></span>
                    </v-card-title>
                    <v-card-text>
                        <v-row justify="center" class="fill-height">
                            <v-progress-circular v-if="registeringPbar"
                                color="blue"
                                class="fill-height"
                                style="position: absolute; z-index: 9999;"
                                model-value="20"
                                :size="50"
                                :width="5"
                                indeterminate
                                >
                            </v-progress-circular>
                        </v-row>
                            <v-form ref="form" class="mt-4" >
                                <v-row no-gutters>
                                    <v-col cols="12"  sm="6" md="4">
                                        <v-text-field label="First Name*" required v-model="state.first_name" density="compact"
                                            :rules="nameRules"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field label="Middle name" density="compact"
                                            v-model="state.middle_name"></v-text-field>
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
                                        <v-text-field label="Password*" v-model="state.password" 
                                            :rules="passwordRules"
                                            :type="showPw ? 'text' : 'password'" 
                                            required 
                                            :append-inner-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                                            @click:append-inner="showPw = !showPw"
                                            density="compact"
                                            ></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <span class="px-2">Gender*</span>
                                        <v-radio-group v-model="isMale" required>
                                            <v-radio label="Female" value="false"></v-radio>
                                            <v-radio label="Male" value="true"></v-radio>
                                        </v-radio-group>
                                    </v-col>
                                        
                                    <v-col cols="4" md="3" sm="3" class="mx-auto">
                                        <v-select :items="state.year" label="Year*"
                                        v-model="selectedYear" required 
                                        :rules="yearRules"
                                        density="compact"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="4" md="3" sm="3" class="mx-auto">
                                        <v-select :items="state.month" label="Month*"
                                        v-model="selectedMonth" required 
                                        :rules="monthRules"
                                        density="compact"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="3" md="3" sm="3" class="mx-auto">
                                        <v-select :items="state.day" label="Day*" 
                                        v-model="selectedDay"
                                        required :rules="dayRules"
                                        density="compact"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field label="Place of birth" v-model='state.PlaceOfBirth' density="compact"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-form> 
                        
                    </v-card-text>
                    <v-sheet 
                    :class="registeringPbar ? 'bg-cyan-lighten-4' : 'bg-grey-lighten-2 pa-2'" 
                    rounded>
                        <small>*indicates required field</small>
                            <v-sheet class="bg-transparent">
                                Already have an account? <RouterLink class="link" to="login">Log In</RouterLink>
                            </v-sheet>
                        <div style="min-height: 20px" class="text-right pr-2" >
                            <Transition name="slide-fade">
                                <v-sheet max-height="50" v-if="this.usedEmail" class="bg-transparent text-red" >
                                    <p style="font-size:large;">This email address is already in use.</p>
                                </v-sheet>
                            </Transition>
                        </div>
                        <v-card-actions style="width: 100%;">
                            
                            <v-btn 
                            color="blue-darken-1" 
                            variant="text" 
                            @click="this.$router.go(-1)"
                            >
                                Go back
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click.prevent="validate()">
                                Sign Up
                            </v-btn> 
                            
                        </v-card-actions>
                        <v-overlay
                            v-model="isRegSuccessful"
                            contained
                            height="150"
                            class="align-center justify-center bg-blue-lighten-4"
                            persistent
                            >
                            <SuccessfulComponent/>
                        </v-overlay>
                    </v-sheet>
                </v-container>
                </v-card>
                
            </v-row>
            
        </v-col>
    </v-container>
</template>

<script>
import { onMounted, ref } from 'vue';
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import fetchData from "../stores/server_routes";
import SuccessfulComponent from './ShowOnSuccessfulRegistration.vue'
import moment from 'moment';
var state = ref(null);
const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedDay = ref(null);
var monthNames = ref(["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"])
var currentDate = new Date();
var yearLimit = currentDate.getFullYear() - 9;

export default {
    components: {
        SuccessfulComponent
    },
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
        isRegSuccessful: false,
        usedEmail: false,
        showPw: false,
        registeringPbar: false,

    }),
    methods: {
        async validate() {
            const { valid } = await this.$refs.form.validate()

            if (valid) {
                this.register();
            }
        },
        async register() {
            this.registeringPbar = true;
            //Először kikeressük a hónapok indexeit a kiválasztott hónappal, és növeljük az indexet 1-el.
            var baseI = monthNames.value.indexOf(selectedMonth.value)+1;
            //Ha az index 0, akkor a kiválasztott hónap december, és beállítjuk az indexet a 12. hónapra
            var monthIndex = baseI == 0 ? baseI = 12 : baseI;
            var formatDate = new Date(selectedYear.value, monthIndex, selectedDay.value);
            var date = moment(formatDate).format("YYYY-MM-DD");
            console.log(formatDate)
            var data = {
                email: state.email,
                Password: state.password,
                personal: {
                    firstName: state.first_name,
                    middleName: state.middle_name,
                    lastName: state.last_name,
                    phoneNumber: null,
                    isMale: this.isMale,
                    DateOfBirth: date,
                    PlaceOfBirth: state.PlaceOfBirth,
                }               
            }
            if (this.state.first_name.length >= 3 ||
                this.last_name.length >= 3 ||
                this.email.length >= 3) 
            {
                try {
                    //console.log(data)
                    const response = await fetchData.methods.fetchData('POST', 'register', data);
                    //DOM notification below
                    if (response == "success") {
                        this.isRegSuccessful = true;
                    }
                    if (response == "used email") {
                        this.usedEmail = true;
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            this.registeringPbar = false; 
        }
    }
}
</script>

<style scoped>
.link {
    color: #1575c4ef; 
   font-family:'Franklin Gothic Medium'; 
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

</style>