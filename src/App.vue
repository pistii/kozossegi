<script setup>
import { RouterView } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import navBar from '@/components/navBar/navBar.vue'
import '@mdi/font/css/materialdesignicons.css'
import '@/variables.scss'
import { loginSetup, SetToDefault } from '@/utils/setup'
import { isLoggedin } from '@/utils/auth'
import OverlayChat from '@/components/ChatCard/OverlayChat.vue';

const initialize = () => {
    if (isLoggedin()) {
        loginSetup();
        SetToDefault();
    }
};

initialize();


</script>


<template >
    <v-app class="bgcolor">
        <header class="bgcolor">
            <KeepAlive>
                <navBar />
                
            </KeepAlive>
        </header>

        <v-row class="bgcolor">
            <!--reszponzív megjelenés: Ha szükség lenne a részegységek módosításához ez hasznos lehet: 
                https://vuetifyjs.com/en/styles/display/#visibility
                -->
            <v-col class="d-none d-xl-block" cols="3"> <!--Bal oldali szegély--->
            </v-col>
            <v-col>
                <RouterView :key="$route.fullPath" /> <!--Tartalmi rész-->
            </v-col>
            <v-col class="d-none d-xl-block" cols="3" > <!--a jobb oldali szegély-->
            </v-col>
        </v-row>
        <OverlayChat />
    </v-app>
</template>


<style>
.bgcolor {
    background: linear-gradient(to bottom, rgba(53, 106, 160, 1) 0%, rgba(53, 106, 160, 1) 100%);
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
