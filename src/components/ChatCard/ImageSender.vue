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
import { fileToBlob } from '@/utils/common.js';

/*
v-file-input set to display: none, and the v-icon triggers the functions of the v-file-input
*/
const imageTypes = ["image/png", "image/jpeg", "image/gif", "image/bmp"];
const videoTypes = ["video/mp4"];
const acceptedTypes = [...imageTypes, ...videoTypes];
export default {
    data() {
        return {
            selectedFile: null,
            imageTypes,
            videoTypes,
            acceptedTypes,
        }
    },
    emits: ['activeMenu'],
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
                    resolve(true);
                }
            });
        },
        triggerFileInput() {
            this.$emit('activeMenu', 'text');
            this.$refs.fileInput.$el.querySelector('input[type="file"]').click();
        },

        async handleFileChange(file) {
            this.selectedFile = file.target.files[0];
            var fileIsValid = await this.validateImage();
            if (fileIsValid) {
                var fileBlob = await fileToBlob(this.selectedFile);
                var fileData = {
                    'url': fileBlob,
                    'fileName': this.selectedFile.name,
                    'fileType': this.selectedFile.type
                };

                //Notify the ChatTextBox about the new added file
                this.$emitter.emit('chat-image-send', fileData);
            }
        }
    },
};
</script>
