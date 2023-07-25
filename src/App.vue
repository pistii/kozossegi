<script setup>
import { RouterLink, RouterView } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {ref, onMounted} from 'vue'

</script>

<template>
  <header>
      <nav>
        <RouterLink to="/" class="v-btn"><v-btn block rounded="lg" size="x-large">Főoldal</v-btn></RouterLink>
        <RouterLink to="/about" class="v-btn"><v-btn block rounded="lg" size="x-large">About</v-btn></RouterLink>
      </nav>
      <template>
      </template>
    </header>
  <RouterView />
</template>

<style scoped>
</style>
