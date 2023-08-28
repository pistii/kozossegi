import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import SvgIcon from '@jamescoyle/vue-icon'

const vuetify = createVuetify({
  components,
  directives,
})
createApp(App).use(vuetify).use(router).use(createPinia()).mount('#app')