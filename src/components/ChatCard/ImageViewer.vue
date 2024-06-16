<template>
    <div
        :class="{ 'ma-2 pa-3 d-flex bg-green rounded wrapContent' : msg.authorId === userId}"
        class="ma-2 pa-3 d-flex bg-blue rounded wrapContent" 
        style="height: 150px;"
        @click="showImage()">
        <v-img  
            :width="300"
            :src="url"/>
    </div>
    <v-dialog 
        v-model="expandImage"
        max-width="1200"
        >
        <v-sheet class="pa-6">
            <v-row class="justify-end">
                <v-icon @click="this.expandImage = false">
                    mdi-close
                </v-icon>
            </v-row>
            <v-row>
                <v-img :width="1200"
                    :src="url">                        
                </v-img>
            </v-row>
        </v-sheet>
    </v-dialog>
</template>

<script>
import fetchData from '@/stores/server_routes';

export default {
    props: {
        'msg': Object, 
        'userId': Number,
    },
    data() {
        return {
            expandImage: false,
            url: null,
            
        }
    },
    mounted() {
        this.createImage();
    },
    methods: {
        async createImage() {
            let image = new Image();
            if (this.msg.chatFile.local) {
                image.src = this.msg.chatFile.fileToken
            }
            else {
                if (!this.msg.chatFile.fileData) {
                    let file = await this.getFile(this.msg.chatFile.fileToken);
                    image.src = `data:${this.msg.chatFile.fileType};base64,${file}`;
                }
                else {
                    image.src = `data:${this.msg.chatFile.fileType};base64,${this.msg.chatFile.fileData}`;
                }
            }
            this.url = image.src;
            this.updateBody();
        },
        
        updateBody() {
            this.$emit('update-scrollHeight');
        },
        showImage() {
            this.expandImage = true;
        },
        async getFile(token) {
            let file = await fetchData.methods.fetchData('GET', 'GetFile', null, token);
            return file;
        },
    }
}
</script>