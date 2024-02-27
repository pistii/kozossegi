<template>
    <v-overlay
        :model-value="showOverlay"
        class="align-center justify-center"
        >
        <v-sheet>
            <v-col class="pa-6">
                <v-row class="align-center justify-center">
                    <v-progress-circular
                        color="primary"
                        indeterminate
                        size="64"
                        class="py-9 align-center justify-center"
                    >
                </v-progress-circular>
                </v-row>
                <v-row class="pa-3">
                    {{ displayMsg }}
                </v-row>
            </v-col>
        </v-sheet>

    </v-overlay>
</template>

<script>
import UserStore from '@/stores/UserStore'

export default {
    props: {
        displayMsg: String,
    },
    computed: {
        showOverlay() {
            return UserStore.getters.getoverlayLoading();
        }
    }
}
</script>