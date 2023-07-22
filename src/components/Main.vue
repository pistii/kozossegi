<script setup>
import SignUp from './SignUp.vue';
import SignIn from './SignIn.vue';
</script>


<template>
    <!-- <v-card class="mx-auto" max-width="344" variant="outlined">
        <v-card-item>

            <div>
                <div class="text-overline mb-1">
                    OVERLINE
                </div>
                <div class="text-h6 mb-1">
                    Headline
                </div>
                <div class="text-caption">Greyhound divisely hello coldly fonwderfully</div>
            </div>
        </v-card-item>

        <v-card-actions>
            <v-btn variant="outlined">
                Button
            </v-btn>
        </v-card-actions>
    </v-card> -->

    <v-container class="bg-surface-variant">
        <v-row class="justify-end">
            <SignUp/>
            <SignIn/>
        </v-row>
  </v-container>
</template>
