<template>
        <div class="textarea-container">
            <v-textarea v-model="msgBox" placeholder="Type your message here..." />
            <v-btn class="custom-button" @click="Comment">Send</v-btn>
        </div>
</template>
  
<script>
import { fetchData } from '../stores/server_routes';

export default {
    data() {
        return {
            msgBox: "",
            

        };
    },
    methods: {
        async Comment() {
            fetchData('postComment', this.msgBox);
        }
    }
};
</script>

<style>
.textarea-container {
    position: relative;
}

.textarea {
    width: 100%;
    height: 200px;
    padding: 10px;
    max-height:200px;

}

.custom-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>