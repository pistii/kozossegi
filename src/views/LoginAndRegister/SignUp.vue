
<template>
    <v-container fluid class="fill-height">
            <v-row class="justify-center">
                <v-card width="800" class="bg-blue-grey-lighten-5"  >
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
                        <register-form />
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
    </v-container>
</template>

<script>
import SuccessfulComponent from '@/components/ShowOnSuccessfulRegistration.vue'
import registerForm from './registerForm.vue'

export default {
    components: {
        SuccessfulComponent,
        'register-form': registerForm,
    },
    data() {
        return {
            registeringPbar: false,
            isRegSuccessful: false,
            usedEmail: false,

        }
    },
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
                var baseI = monthNames.value.indexOf(selectedMonth.value) + 1;
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
                    this.email.length >= 3) {
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