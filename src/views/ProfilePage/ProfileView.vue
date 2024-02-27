<template>
    <v-container class="d-flex d-lg-flex">
        <v-row>
            <v-col cols="12">
                <!--:key=this.friends, this.reload-->
                <header-component 
                :user="this.user" 
                :publicity="publicity" 
                :key="this.friends"
                @removeFriend="removeFriend()"></header-component>
                <v-alert
                    v-model="remindUserOfUnfulfilledReg"
                    border="start"
                    variant="tonal"
                    closable
                    @click:close="PutReminderOfUnfulfilledReg(7)"
                    color="deep-purple-accent-4"
                    title="Még nem töltötted ki teljesen a felhasználói profilod"
                    class="my-4 text-right"
                    >
                    <div class=" d-flex justify-space-between">
                        <span class=" me-auto">
                            <v-btn 
                            class="text-none my-2 elevation-7 " 
                            color="primary" 
                            @click="this.showCompletePersonalDialog = true">Kattints ide</v-btn> 
                            és fejezd be a regisztrációs folyamatot
                        </span>
                            <v-btn  
                        class="text-none ml-100 my-2 elevation-7" 
                        color="primary" 
                        variant="outlined"
                        @click="PutReminderOfUnfulfilledReg(999)">Ne jelenjen meg többé</v-btn> 
                    </div>
                </v-alert>
                <div>
                    <v-row>
                        <v-col class="d-block d-md-block">
                            <!--responsivity for the left panel-->
                            <text-area-with-button @posts="addPost" />
                            <center-content 
                            :posts="posts" 
                            :totalPages="totalPages"
                            :key="posts"
                            ></center-content>
                        </v-col>

                        <!--responsivity for the right panel-->
                        <v-col 
                        style="background-color: transparent; " 
                        v-show="this.rightPanelVisible"> 

                            <!--friends-component bg color equals vuetify blue-lighten-3-->
                            <friends-component class="d-none d-md-block friendsComponent" 
                            :friends="friends" 
                            :key="friends"  
                            style="background-color: #1e88e53a;
                            border-radius: 15px" 
                            @loadUserData="this.loadUserData"
                            />
                            <div class="pt-4">
                                <Suspense>
                                    <image-container-component  />
                                </Suspense>
                            </div>
                            <div ref="myElement" 
                                class="my-element" 
                                :class="{ 'visible': this.isElementVisible }">
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
        <v-row justify="space-around">
            <v-col cols="auto">
           <v-overlay
                v-model="shouldshowNewPasswordRestoreDialog"
                contained
                class="align-center justify-center"
            >
                <v-sheet class="pa-2">
                    <h2 class="text-center">
                        Sikeresen visszaállítottad a jelszavad, 
                        <br>a továbbhaladás érdekében módosítsd
                    </h2>
                    <div class="px-6">
                            <v-text-field
                                v-model="password1" 
                                autocomplete="new-password"
                                :type="showPw ? 'text' : 'password'" 
                                
                                :append-inner-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="showPw = !showPw"
                                density="compact"
                                @keyup="userTypes()"
                                >
                            </v-text-field>
                            <v-text-field 
                            v-model="password2" 
                            type="password"
                            autocomplete="new-password"
                            density="compact"
                            >
                            </v-text-field>
                    </div>
                    <!-- !passwordIsValid() -->
                    <div v-if=" !passwordIsValid() && !isTyping"
                    style="font-size: 12px;">
                    A jelszónak 8-32 karakter hosszúnak kell lennie, és minimum 1 kisbetűt és 1 nagybetűt kell tartalmaznia
                    </div>
                    <div  class="text-right">
                        <v-btn
                            :color="
                            passwordIsValid()
                            ? 'success' : 'grey'"
                            @click="changePass()"
                        >
                            Módosítom a jelszavam.
                        </v-btn>
                    </div>
                </v-sheet>
        </v-overlay>

        <overlay-loading :displayMsg="this.pwSuccessMsg" />

        <overlay-complete-personal 
        :showCompleteDialog="this.remindUserOfUnfulfilledReg" 
        @closeModal="this.remindUserOfUnfulfilledReg = false;"/>
    </v-col>
  </v-row>

    </v-container>
</template>


<script>
import TextAreaWithButton from '@/components/TextAreaWithButton.vue';
import CenterContent from './CenterContent.vue';
import FriendsComponent from './FriendsComponent.vue';
import Header from './ProfilePageHeaderComponent.vue';
import ImageContainerComponent from './ImageContainerComponent.vue';
import OverlayLoadingComponent from '@/components/OverlayLoadingComponent.vue';
import OverlayCompletePersonal from '@/components/OverlayCompletePersonal.vue'
import Observer from '@/components/Observer.vue';

import fetchData from '@/stores/server_routes.js';
import UserStore from '@/stores/UserStore';

import { useRoute } from 'vue-router';
import { ref } from 'vue';
import router from '/src/router/index.js';
import { mapGetters } from 'vuex';

const route = ref(null);

var userId = ref(0);
let user = ref([]);
let posts = ref([]);
let totalPages = ref(0); //for post

let friends = ref([]);
let publicity = ref("");
const rightPanelVisible = ref(true);
const lastYvisible = ref(0);

export default {
    components: {
        Observer,
        'text-area-with-button': TextAreaWithButton,
        'center-content': CenterContent,
        'friends-component': FriendsComponent,
        'header-component': Header,
        'image-container-component': ImageContainerComponent,
        'overlay-loading': OverlayLoadingComponent,
        'overlay-complete-personal': OverlayCompletePersonal,

    },
    computed: {
        ...mapGetters(['shouldshowNewPasswordRestoreDialog']),
        
    },
    created() {
         route.value = useRoute()
         if (route.value.name == "profile") {
            this.loadUserData(UserStore.state.userId, 'viewProfile');
         }
         else {
            userId.value = route.value.params.id
            
            this.loadUserData(userId.value, 'viewProfile');
         }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll(); 
        UserStore.commit('setPasswordModifyDialog', false);
    },
    data() {
        return {
            user,
            friends,
            posts,
            totalPages,
            publicity,
            rightPanelVisible,
            isElementVisible: false,
            password1: '', pw1lastModify: null,
            password2: '', pw2lastModify: null,
            showPw: false,
            isTyping: false,
            lastKeyPress: null,
            pwSuccessMsg: 'A jelszó módosítása sikeresen megtörtént, egy pillanat...',
            remindUserOfUnfulfilledReg: false,
        }
    },
    methods: {
        async loadUserData(id, path) {
            router.push({name: path, params: {id: id}});
            if (id > 0)
            {
                var response = await fetchData.methods.fetchData('GET', 'GetProfile', null, id, UserStore.getters.getUserId());
                friends.value = response.friends.value
                posts.value = response.posts.data
                totalPages.value = response.posts.totalPages
                user.value = response.personalInfo
                publicity.value = response.publicityStatus
                this.remindUserOfUnfulfilledReg = response.settings.remindUserOfUnfulfilledReg
                UserStore.commit('setOnlineState', response.settings.isOnlineEnabled)
                console.log(response.settings)
            }
            this.setUserDataGlobally(response.personalInfo, response.friends.value);
        },
        setUserDataGlobally(user, friends) {
            UserStore.commit('setUser', user)
            UserStore.commit('setUserFriends', friends)
        },
        handleScroll() {
            //scroll/sticky effect: https://firefox-source-docs.mozilla.org/performance/scroll-linked_effects.html
            const element = this.$refs.myElement;
            if (element != null)
            {
                const rect = element.getBoundingClientRect();
                this.isElementVisible = rect.bottom >= 0;

                if (!this.isElementVisible) {
                    if (rightPanelVisible.value != false)
                    {
                        rightPanelVisible.value = false
                        lastYvisible.value = window.scrollY;
                    }
                }
                else {
                    if (window.scrollY<lastYvisible.value)
                    {
                        rightPanelVisible.value = true
                    }
                }
            }
            //console.log(rightPanelVisible.value)
        },

        removeFriend() {
            this.friends = this.friends.filter((user)=>user.id !== UserStore.getters.getUserId())
        },
        addPost(post) {
            posts.value.unshift(post)
        },

        //#region Forgot pasword and resetting....
        passwordIsValid() {
            var pwCorrect = this.password1 === this.password2 && 
            this.password1.length >= 8 && this.password1.length <= 32 &&
            this.password2.length >= 8 && this.password2.length <= 32 &&
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(this.password1) && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(this.password2);
            
            return pwCorrect;
        },
        async changePass() {
            if (this.passwordIsValid()) {
                var user = UserStore.getters.getUser();
                user.password = this.password1; //Egy öröklött personal táblát vár
                user.Password2 = this.password2;

                await fetchData.methods.fetchData('POST', 'ModifyPw', user)
                .then(resp => resp == "Jelszó módosítás megtörtént." ? 
                this.passwordHaveBeenChanged(resp) : this.errorOnPasswordChange(resp));
                
            }
        },
        passwordHaveBeenChanged(data) {
            UserStore.commit('setPasswordModifyDialog', false); //Disables the password requirement overlay
            setTimeout(() => { //Show overlay and load page
                UserStore.commit('setOverlayLoading', false);
                location.reload();
            }, 2000);
            UserStore.commit('setOverlayLoading', true)
        },
        errorOnPasswordChange(data) {
            //Gyakorlatilag a backend a két jelszót veti össze, de mivel már a frontenden ez megtörtént, szinte esélytelen hogy ez a metódus lefusson...
        },
        userTypes() {
            this.handleTyping();          
        },
        handleTyping() {
            this.isTyping = true;
            this.lastKeyPressTime = Date.now();

            // Ellenőrizzük, hogy az utolsó gépelés óta eltelt-e legalább 3 másodperc
            setTimeout(() => {
            if (Date.now() - this.lastKeyPressTime >= 3000) {
                // Ha eltelt legalább 3 másodperc, akkor hajtsd végre az eseményt vagy a műveletet
                console.log(this.isTyping)
                this.isTyping = false;
            }
            }, 3000);
        },
        //#endregion

        async PutReminderOfUnfulfilledReg(days) {
            var dataToSend = {
                days: days
            }
            await fetchData.methods.fetchData('PUT', 'turnOffReminder', dataToSend);
        },
    },
    beforeUnmount() {
        this.isElementVisible = false;
        window.removeEventListener('scroll', this.handleScroll);
    },
}

</script>

<style>
.visible {
  background-color: rgba(144, 238, 144, 0);
}
.my-element {
  height: 0px;
  margin-top: 200px; /* Görgetéshez szükséges tartalom hozzáadása */
}

.avatar {
    width: 200px;
}


.viewProfileBtn {
    font-size: 10px;
    padding: 0px;
    background-color: #57b9ea;
}

.no-uppercase {
     text-transform: unset !important;
}

</style>