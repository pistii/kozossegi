<template>
    
    <v-dialog
      v-model="this.showCompleteDialog"
      width="800"
      persistent
    >

    <v-row justify="center" >
      <v-card>
        <v-card-title>
          <span class="text-h5">Tölts fel egy profilképet</span>
        </v-card-title>
        <v-card-text>
            <v-form 
            @submit.prevent="saveUserInfo" 
            class="pa-2">
                <div>
                    <v-file-input 
                    :rules="[() => !!selectedFile || 'Nincs kiválaszott kép.']" 
                    prepend-icon="mdi-camera"
                    density="compact"
                    label="Kép kiválasztása"
                    accept="image/*"
                    ref="fileInput"
                    @change="handleFileChange" 
                    
                    style="height: 25%;"
                    >
                    </v-file-input>

                </div>
            </v-form>
        </v-card-text>
        

        <v-card-title>
          <span class="text-h5">Személyes adatok</span>
        </v-card-title>
        <v-card-text >
            <div class="py-2 d-flex">
                <span class="w-25 pr-3">Lakhely</span>
                <input class="pa-1 txtfield"
					v-model="this.placeOfResidence"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    maxlength = "70"
				/>
            </div>
            
            <div class="py-2 d-flex">
                <span class="w-25 pr-2">Telefonszám</span>
                <input class="pa-1 txtfield"
				v-model="this.phoneNumber"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                maxlength = "15"
				/>
            </div>

            <div class="py-2 d-flex">
                <span class="w-25 pr-2">Foglalkozás</span>
                <input class="pa-1 txtfield"
				v-model="this.Profession"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                maxlength = "60"
				/>
            </div>

            <div class="py-2 d-flex">
                <span class="w-25 pr-2">Munkahely</span>
                <input class="pa-1 txtfield"
				v-model="this.Workplace"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                maxlength = "120"
				/>
            </div>
            
        </v-card-text>
        
        
        <v-card-title>
            <span class="text-h5">Tanulmányok</span>
        </v-card-title>        
        <v-card-text>

            <div class="py-2 d-flex">
                <span class="w-25 pr-2">Iskola neve</span>

                <input class="pa-1 txtfield"
                v-model="this.SchoolName"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                maxlength = "120"
                />
            </div>

            <div class="py-2 d-flex">
                <span class="w-25 pr-2">Osztály megnevezése</span>
                <input class="pa-1 txtfield"
                v-model="this.Class"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                maxlength = "120"
                />
            </div>

            <div class="py-2 d-flex">
                <span class="w-25 pr-2">Kezdés éve</span>
                <input class="pa-1 txtfield"
                v-model="this.StartYear"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                maxlength = "11"
                type="date"
                />
            </div>
            <div class="py-2 d-flex">
                <span class="w-25 pr-2">Végzés éve</span>
                <input class="pa-1 txtfield"
                v-model="this.EndYear"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                maxlength = "11"
                type="date"

                />
            </div>
        </v-card-text>
        
        <v-card-title>
            <span class="text-h5">Biztonság</span>
            <div class="text-caption">Arra az esetre, ha nem tudsz bejelentkezni a fiókba, ezt az emailt tudod hitelesítés gyanánt használni.</div>
        </v-card-title>

        <v-card-text>
            <div class="py-2 d-flex">
                <span class="w-25 pr-2">Másodlagos Email cím</span>
                <input class="pa-1 txtfield"
                v-model="this.SecondaryEmailAddress"
                />
            </div>
        </v-card-text>
        

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="saveUserInfo()"
          >
            Ok
          </v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="closeSettings()"
          >
            Mégse
          </v-btn>
        </v-card-actions>
        <span class="text-caption">Hibát találtál az oldalon? <a href="#">Ide kattintva jelezheted számomra.</a></span> <!--TODO: sendMe-->
      </v-card>
  </v-row>
  </v-dialog>
</template>

<script>
export default {
    props: {
        showCompleteDialog: Boolean
    },
    data() {
        return {
            modal: true,
			selectedFile: null,
			placeOfResidence: '',
			phoneNumber: '',
            SecondaryEmailAddress: '',
            Profession: '',
            Workplace: '',
            SchoolName: '',
            Class: '',
            StartYear: null,
            EndYear: null,
        }
    },
	methods: {
		closeSettings() {
			this.$emit('closeModal');
		},
		handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async saveUserInfo() {
            const formData = new FormData();
            if (this.selectedFile != null) {
                formData.append('Name', this.selectedFile.name); 
                formData.append('Type', this.selectedFile.type);
                formData.append('File', this.selectedFile);

                formData.append('placeOfResidence', this.placeOfResidence);
                formData.append('phoneNumber', this.phoneNumber);
                formData.append('Profession', this.Profession);
                formData.append('Workplace', this.Workplace);
                formData.append('SchoolName', this.SchoolName);
                formData.append('Class', this.Class);
                formData.append('StartYear', this.StartYear);
                formData.append('EndYear', this.EndYear);

                formData.append('SecondaryEmailAddress', this.SecondaryEmailAddress);
                
                PostImage('POST', 'avatarUpload', formData);
                this.selectedFile = null;
            }
        },
	}
}
</script>

<style>
.txtfield {
  border: 1px solid black;
  border-radius: 3px;
  width: 100%;
  margin-right: 10%;
}


</style>