<template>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        width="1024"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Settings</span>
          </v-card-title>
              
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="dialog = !dialog"
            >
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="dialog = !dialog"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>

<script>
    export default {
        props: {
            showSettingsOption: Boolean
        },
        data() {
            return {
                dialog: this.showSettingsOption //Todo: the dialog doesn't open on the first click
            }
        }
    }
</script>