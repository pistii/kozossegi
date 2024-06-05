import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import UserStore from './stores/UserStore'

import { AVPlugin } from "vue-audio-visual";
import emitter from './stores/eventBus'

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
});

app.config.globalProperties.$emitter = emitter;

app
.use(UserStore)
.use(vuetify)
.use(router)
.use(AVPlugin)
.mount('#app');