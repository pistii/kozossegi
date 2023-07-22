<script setup>
import SignUp from './SignUp.vue';
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
            
            <v-btn class="ml-2" color="primary" v-bind="props" to="/login">
                Sign In
            </v-btn>
        </v-row>
  </v-container>
</template>
