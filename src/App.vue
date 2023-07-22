<script setup>
import { RouterLink, RouterView } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {ref, onMounted} from 'vue'

</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Főoldal</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
      <template>
      </template>
    </header>
  <RouterView />
</template>

<style scoped>
</style>
