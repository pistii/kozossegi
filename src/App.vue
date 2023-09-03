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
  <navBar />

  <RouterView />

  <footer class="footer">
    <v-row>
      <v-col>
        Contact
      </v-col>
    </v-row>
  </footer>
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
