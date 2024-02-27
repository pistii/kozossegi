<template>
    <v-container class="settingsContainer">

    <v-row class="bg-grey-lighten-2">
        <v-col cols="3">
            <v-card class="mx-auto settings_menuBar" >
                <v-list >
                    <v-list-subheader>Beállítások</v-list-subheader>

                    <v-list-item v-for="(item, i) in items" :key="i" @click="handleSettingsView(item.id)">
                        <template v-slot:prepend>
                            <v-icon :icon="item.icon"></v-icon>
                        </template>

                        <v-list-item-title class="settings_menuBar" >{{ item.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-col>
        <v-col>
            
            <form>
            <v-card>

                <v-card-text v-if="this.currentView == 1">
                    <v-card-title>
                        <span class="text-h5">Profilkép módosítása</span>
                    </v-card-title>
                    <v-form class="pa-2">
                        <div>
                            <v-file-input :rules="[() => !!selectedFile || 'Nincs kiválaszott kép.']"
                                prepend-icon="mdi-camera" density="compact" label="Kép kiválasztása" accept="image/*"
                                ref="fileInput" @change="handleFileChange" class="w-50 " style="height: 25%;"
                                >
                            </v-file-input>
                        </div>
                    </v-form>
                </v-card-text>



                <v-card-text v-if="this.currentView == 2">
                <v-card-title>
                    <span class="text-h5">Személyes adatok</span>
                </v-card-title>
                    <v-row>
                        <v-col cols="4"> 
                                <span class="pr-3">Vezetéknév</span>
                                <input class="pa-1 txtfield" v-model="this.firstName" 
                                @blur="inputChanged('firstName', this.firstName)"
                                @input="checkLength"
                                maxlength = "30"
                                />
                                
                        </v-col>
                        <v-col cols="4">
                                <span class="pr-3">Középső név</span>
                                <input class="pa-1 txtfield" v-model="this.middleName" 
                                @blur="inputChanged('middleName', this.middleName)"
                                @input="checkLength"
                                maxlength = "30"
                                /> <!--blur event: triggers if input loses focus-->
                        </v-col>
                        <v-col cols="4">
                                <span class="px-3">Keresztnév</span>
                                <input class="pa-1 txtfield" v-model="this.lastName" 
                                @blur="inputChanged('lastName', this.lastName)"
                                @input="checkLength"
                                maxlength = "30"
                                />
                        </v-col>
                    </v-row>
                    <div class="py-2">
                        <span class=" pr-2 py-2">Lakhely</span>
                        <input class="pa-1 txtfield" v-model="this.placeOfResidence" 
                            @blur="inputChanged('PlaceOfResidence', this.placeOfResidence)"
                            @input="checkLength"
                            maxlength = "70"
                        />
                    </div>
                    <div class="py-2">
                        <span class=" pr-2 py-2">Születési hely</span>
                        <input class="pa-1 txtfield" v-model="this.placeOfBirth" 
                            @blur="inputChanged('placeOfBirth', this.placeOfBirth)"
                            @input="checkLength"
                            maxlength = "100"
                        />
                    </div>
                    <div class="py-2">
                        <span class=" pr-2 py-2">Születési idő</span>
                        <input disabled class="pa-1 txtfield" v-model="this.dateOfBirth" 
                        />
                    </div>
                    <div class="py-2">
                        <span class=" pr-2 py-2">Foglalkozás</span>
                        <input class="pa-1 txtfield" v-model="this.Profession" 
                            @blur="inputChanged('profession', this.Profession)"
                            @input="checkLength"
                            maxlength = "60"
                        />
                    </div>
                    <div class="py-2">
                        <span class=" pr-2 py-2">Munkahely</span>
                        <input class="pa-1 txtfield" v-model="this.Workplace" 
                            @blur="inputChanged('workplace', this.Workplace)"
                            @input="checkLength"
                            maxlength = "120"
                        />
                    </div>
                </v-card-text>
                
                <v-card-text v-if="this.currentView == 3">
                    <v-card-title>
                        <span class="text-h5">Közösség</span>
                    </v-card-title>
                    <span>Frissítenéd a kapcsolati státuszod? Jó helyen jársz.</span>
                    <div class="py-2">
                        <span class=" pr-2">Kapcsolat</span><input />
                    </div>
                    <div class="py-2">
                        <span class=" pr-2">Elérhető állapot</span>
                        <v-checkbox :label="isOnline ? 'Online állapot bekapcsolva' : 'Online állapot kikapcsolva'" 
                        v-model="isOnline"
                        >
                        </v-checkbox>

                    </div>
                </v-card-text>

                <v-card-text v-if="this.currentView == 4">
                    <v-card-title>
                    <span class="text-h5">Biztonság</span>
                </v-card-title>

                    <div class="py-2">
                        <span class="pr-3">Email cím módosítása</span>
                        <input class="pa-1 txtfield" v-model="this.EmailAddress"
                        @blur="inputChanged('EmailAddress', this.EmailAddress)"
                        @input="checkLength"
                        maxlength = "30"
                        />
                    </div>

                    <div class="py-2">
                        <span class="pr-3">Másodlagos email cím</span>
                        <input class="pa-1 txtfield" v-model="this.SecondaryEmailAddress"
                        @blur="inputChanged('secondaryEmailAddress', this.SecondaryEmailAddress)"
                        @input="checkLength"
                        maxlength = "30"
                        />
                    </div>

                    <div class="py-2">
                        <span class="pr-3">Jelszó módosítása</span>
                        <input class="pa-1 txtfield" v-model="this.modifyPass1"
                            @blur="inputChanged('modifyPass1', this.modifyPass1)"
                            @input="checkLength"
                            maxlength = "40"
                        />
                    </div>
                    <div class="py-2">
                        <span class="pr-3">Jelszó mégegyszer</span>
                        <input class="pa-1 txtfield" v-model="this.modifyPass2" 
                            @blur="inputChanged('modifyPass2', this.modifyPass2)"
                            @input="checkLength"
                            maxlength = "40"
                        />
                    </div>

                    <div class="py-2">
                        <span class="pr-3">Telefonszám</span>
                        <input 
                            class="pa-1 txtfield" 
                            v-model="this.phoneNumber" 
                            @blur="inputChanged('phoneNumber', this.phoneNumber)"
                            @input="checkLength"
                            maxlength = "15"
                            type="tel"
                        />

                    </div>
                </v-card-text>
                <p v-if="errors.length">
                    <ol style="color: red;">
                        <b v-for="error in errors">{{ error }}</b>
                    </ol>
                </p>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green-darken-1" 
                        variant="text" 
                        :loading="loadingBtn"
                        @click="validateForm()" >
                        Mentés
                        <template v-slot:loader>
                            <v-progress-circular indeterminate></v-progress-circular>
                        </template>
                    </v-btn>
                    <v-btn color="green-darken-1" variant="text" @click="closeSettings()">
                        Mégse
                    </v-btn>
                </v-card-actions>


                <span class="text-caption">Hibát találtál az oldalon? <a href="#">Ide kattintva írhatsz.</a></span>
            </v-card>
        </form>

        </v-col>
    </v-row>
</v-container>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { reactive } from 'vue'

import UserStore from '@/stores/UserStore'
import { PostImage } from '@/stores/server_routes'


var user = UserStore.getters.getUser();

export default {
    setup() {
        return {
            v$: useVuelidate()
        }
    },
    data() {
        return {
            selectedFile: null,
            currentView: 1,
            items: [
                { id: 1, text: 'Profil beállítások', icon: 'mdi-cog' },
                { id: 2, text: 'Személyes', icon: 'mdi-account' },
                { id: 3, text: 'Közösség', icon: 'mdi-account-multiple' },
                { id: 4, text: 'Biztonság', icon: 'mdi-shield'}
            ],
            //personal
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            placeOfResidence: user.placeOfResidence,
            placeOfBirth: user.placeOfBirth,
            dateOfBirth: user.dateOfBirth,
            Profession: user.profession,
            Workplace: user.workplace,
            //Community
            reslationshipWith: '',
            isOnline: UserStore.state.userIsOnline,
            //Security
            phoneNumber: user.phoneNumber,
            EmailAddress: '',
            SecondaryEmailAddress: '',
            modifyPass1: '',
            modifyPass2: '',
            changedInputs: {},

            //For display
            loadingBtn: false,
            //Validation
            errors: [],
        }
    },
    methods: {
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        inputChanged(field, item) { //Azok az inputok amik változtak hozzáadása az objecthez 
            this.changedInputs[field] = item;
        },
        validateForm() {
            this.errors = [];
            this.v$.$touch(); 
            if (this.firstName.length < 1 || this.lastName.length < 1) {
                this.errors.push("Vezetéknév és keresztnév nem lehet nulla.")
            }
            //A magyar számokat ellenőrzi, Az első 3 karakter +36, 2 karakter 30/70, a hátralévő karakterek 0-9-ig 9 hosszúságig.
            if (this.phoneNumber.length > 0 && !/^(^\+[36]{2}|[30]{2}|[70]{2})([0-9]{9}$)$/.test(this.phoneNumber) ) { //Előhívószám alapján is lehet validálni a későbbiek során: https://www.digitalis.hu/tudasbazis/hlp_00003.php
                this.errors.push("Telefonszám nem megfelelő.");
            }
            if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.EmailAddress)) {
                this.errors.push("Email cím formátuma nem megfelelő.")
            }
            if (this.SecondaryEmailAddress !== '') {
                if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.SecondaryEmailAddress))
                {
                    this.errors.push("A másodlagos email cím formátuma nem megfelelő.")
                }
            }
            if (this.modifyPass1.length !== 0 && this.modifyPass1.length < 8 &&
                this.modifyPass2.length !== 0 && this.modifyPass2.length < 8
            ) {
                this.errors.push("A jelszó túl rövid. Minimum 8 karakter.")
            }
            if (this.modifyPass1 !== this.modifyPass2) {
                this.errors.push("A jelszó nem egyezik.")
            }


            //Sikertelen validálás
            if (this.errors.length > 0) return;
            
            //A validáció sikeres volt
            this.saveSettings();
            this.loadingBtn = !this.loadingBtn;
        },
        async saveSettings() {

            const formData = new FormData();
            formData.append('UserId', user.id);
            formData.append('isOnline', this.isOnline);

            if (this.selectedFile != null) {
                formData.append('Name', this.selectedFile.name);
                formData.append('Type', this.selectedFile.type);
                formData.append('File', this.selectedFile);
            }
            for (const [key, value] of Object.entries(this.changedInputs)) {
                formData.append(key, value);
            }

            var resp = await PostImage('PUT', 'modify', formData); //Mert a képet is tartalmazhatja.
            
            //Frissítsük a lokális és globális változót
            UserStore.commit('setUser', resp);
            user = resp;
            this.loadingBtn = false;
        },
        
        closeSettings() {
            this.$emit('closeModal');
        },
        handleSettingsView(id) {
            this.errors = [];
            this.currentView = id;
        },
    },
}

function checkLength() {
    if (field.length > field.maxLength) 
        return field.value = field.slice(0, field.maxLength);
}
</script>

<style>
.imageInput {
    max-height: 10px;
}

.txtfield {
    border: 1px solid black;
    border-radius: 3px;
    width: 100%;
    margin-right: 10%;
}

.settingsContainer {
    min-height: 300px;
    height: 460px;
}

.settings_menuBar {
    word-wrap: break-word;
    white-space: pre-wrap;
}
</style>
