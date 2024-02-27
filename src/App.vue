<script setup>
import { RouterView } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import navBar from '@/assets/navBar.vue'
import OnlineFriendsView from '@/views/OnlineFriendsView.vue';
import OverlayMessageDialogComponent from '@/views/OverlayMessageDialogComponent.vue'
import '@mdi/font/css/materialdesignicons.css'
import '@/variables.scss'
import { loginSetup } from '@/utils/setup'
import { isLoggedin } from '@/utils/auth'
import { createNewChatRoom, doesRoomExist } from '@/utils/MessageHelper.js'
import MessageStore from '@/stores/MessageStore';
import { getFullName, getUserAvatar, formatDate } from '@/utils/common';

const initialize = () => {
    if (isLoggedin()) {
        loginSetup();
    }
};

initialize();


</script>

<script>
export default {
    data() {
        return {
            renderComponent: true,
            createNewChatRoom,
        }
    },
    components: {
        OnlineFriendsView,
        OverlayMessageDialogComponent
    },
    computed: {
        isLoggedin() {
            this.forceUpdater();
        },
        getOpenedChatRooms() {
            return MessageStore.getters.getOpenedChatRooms();
        }
    },
    methods: {
        async forceUpdater() {
            this.renderComponent = false;

            // Wait for the change to get flushed to the DOM
            await this.$nextTick();

            // Add the component back in
            this.renderComponent = true;
        },
        async sendMessage(user) {
            var createdChatRoom = await createNewChatRoom(user)
            MessageStore.commit('setOpenedChatRooms', createdChatRoom);
        }

    }
}
</script>

<template >
    <v-app class="bgcolor">
        <header class="bgcolor">
            <KeepAlive>
                <navBar />
            </KeepAlive>
        </header>

        <v-row class="bgcolor">
            <!--responsiveness: 
          https://vuetifyjs.com/en/styles/display/#visibility
        -->
            <v-col class="d-none d-xl-block" cols="3">
            </v-col>
            <v-col>
                <RouterView :key="$route.fullPath" />
            </v-col>
            <v-col class="d-none d-xl-block" cols="3" >
                
            </v-col>

           
        </v-row>
        <div class="bg-transparent" >
            <OverlayMessageDialogComponent v-if="getOpenedChatRooms.length>0"
            class=" overlayChatPanel "
            />

            <div >
                <OnlineFriendsView v-if="isLoggedin()"  />
            </div>
        </div>
    </v-app>
</template>


<style>
.bgcolor {
    background: linear-gradient(to bottom, rgba(53, 106, 160, 1) 0%, rgba(53, 106, 160, 1) 100%);
}

.overlayChatPanel {
    position: fixed;
    bottom: 0;
    min-width: 150px;
    max-width: 100%;
    background-color: rgba(26, 25, 25, 0.368);
    text-align: left;
    width: 80%;
    height: 400px;
    right: 20%;
}


 /*
//Set back to default

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}

article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}


.inner-container {
  background-color: rgb(67, 108, 146);
  border-radius: 15px;
}
 */

</style>
