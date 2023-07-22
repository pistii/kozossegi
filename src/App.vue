<script setup>
import { RouterLink, RouterView } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import SignUp from './components/SignUp.vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {ref, onMounted} from 'vue'

</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Főoldal</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <SignUp/> 
      </nav>
      <template>
      </template>
    </header>
  <RouterView />
</template>

<style scoped>
</style>
