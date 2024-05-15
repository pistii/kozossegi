<template>
    <div class="text-center">
      <v-snackbar
        location="top"
        :timeout="2000"
        v-model="snackbar"
        vertical
      >
        <div class="text-subtitle-1 pb-2">{{ errorMessage }}</div>
  
        <p>{{ errorMessageDescription }}</p>
  
        <template v-slot:actions>
          <v-btn
            color="indigo"
            variant="text"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </template>

<script>
export default {
    props: {
        errorMessage: String,
        errorMessageDescription: String
    },
    data() {
        return {
            snackbar: true,

        }
    }
}
</script>