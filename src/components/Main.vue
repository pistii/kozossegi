<template>
    <Welcome />
    
</template>

<script>
import Welcome from './Welcome.vue';
export default {
    components: {
        Welcome,
    },
    data() {
        return {
            items: this.items
        }
    }
}
</script>
