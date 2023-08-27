<template>
        <div class="textarea-container">
            <v-textarea v-model="message" placeholder="Type your message here..." />
            <v-btn class="custom-button" @click="Comment">Send</v-btn>
        </div>
</template>
  
<script>
export default {
    data() {
        return {
            message: "",
            

        };
    },
    methods: {
        Comment() {
            console.log("comment sent:", this.message);
        }
    }
};
</script>

<style>
.textarea-container {
    position: relative;
}

textarea {
    width: 100%;
    height: 200px;
    padding: 10px;
}

.custom-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>