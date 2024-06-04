<template>
    <v-file-input 
        ref="fileInput" 
        style="display: none;" 
        :accept="acceptedTypes"
        @change="handleFileChange">
    </v-file-input>
    <v-icon 
        class="px-6 py-3 mb-2 menu" 
        @click="triggerFileInput">
        mdi-image
    </v-icon>
</template>


<script>
import { onSendMessage } from '@/utils/MessageHelper.js';
import eventBus from '@/stores/eventBus.js';
import { fileToBlob } from '@/utils/common.js';

/*
v-file-input set to display: none, and the v-icon triggers the functions of the v-file-input
*/
export default {
    data() {
        return {
            selectedFile: null,
            acceptedTypes: ["image/png", "image/jpeg", "image/gif", "image/bmp"]
        }
    },
    methods: {
        validateImage() {
            return new Promise((resolve, reject) => {
                if (!this.selectedFile) {
                    reject("No selected file");
                }
                else if (this.selectedFile.size / 1024 >= 15 * 1024) {
                    alert(`max size: 15MB. Image size: ${this.selectedFile.size / 1024}.`);
                    this.selectedFile = null;
                    reject("Max allowed size: 15Mb");
                }
                else if (!this.acceptedTypes.includes(this.selectedFile.type)) {
                    alert("file type is invalid");
                    this.selectedFile = null;
                    reject("Not allowed file type.");
                }
                else {
                    resolve("valid");
                }
            });
        },
        triggerFileInput() {
            this.$refs.fileInput.$el.querySelector('input[type="file"]').click();
        },

        async handleFileChange(file) {
            this.selectedFile = file.target.files[0];
            var fileIsValid = await this.validateImage();
            if (fileIsValid === 'valid') {
                var fileBlob = await fileToBlob(this.selectedFile);
                var fileData = {
                    'url': fileBlob,
                    'fileName': this.selectedFile.name,
                    'fileType': this.selectedFile.type
                };
                console.log("url read: " + fileBlob);
                //Notify the ChatTextBox about the new added file
                eventBus.emit('chat-image-send', fileData);
            }
        },
        async uploadFile() {
            await onSendMessage('', selectedFile, selectedFile.type, this.uploadResult);
        },
    },
};
</script>
