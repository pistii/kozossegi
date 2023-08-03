<script setup>
import { RouterLink, RouterView } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { ref, onMounted } from 'vue'
import navBar from '/src/assets/navBar.vue'

</script>

<template>
  <header>

  </header>
  <navBar/>

  <RouterView />
</template>

<style scoped></style>
