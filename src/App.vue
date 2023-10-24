<script setup>
import { RouterLink, RouterView } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { ref, onMounted } from 'vue'
import navBar from '/src/assets/navBar.vue'
import '@mdi/font/css/materialdesignicons.css'

</script>

<template>
  <header>

  </header>
  <KeepAlive>
    <navBar />
  </KeepAlive>

  
  <v-row>
    <!--responsiveness: 
      https://vuetifyjs.com/en/styles/display/#visibility
    -->
  <v-col class="d-none d-md-block">
  </v-col>
  <v-col cols="auto" >      
    <RouterView />
  </v-col>
  <v-col class="d-none d-md-block">
  </v-col>

  <footer class="footer">
    <v-row>
      <v-col>
        Contact
      </v-col>
    </v-row>
  </footer>
</v-row>
</template>

<style>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: rgba(26, 25, 25, 0.368);
  text-align: left;
}
</style>
