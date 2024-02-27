<template>
    <v-container style="background-color: #1e88e53a; border-radius: 15px" class="pt-4"  >
        <v-sheet class="bg-info pa-2" rounded >
            <h4 color="indigo-lighten-5">
                Fényképek
            </h4>
        </v-sheet>
        <v-col cols="3" xl="auto" md="auto" class="mb-1 mx-1" style="min-height: 20rem;" >
            <v-row no-gutters justify="space-between" >
                <div v-for="post in Posts[0]" class="pb-2">
                    <v-hover v-slot="{ isHovering, props }">
                        <v-card  v-bind="props">
                            <v-avatar size="120" rounded="3" class="pa-1">    
                                <!-- <v-img :src="getImage(post.mediaContents[0].fileName)" /> 
                                    TODO: disabled to reduce costs    
                                -->
                            </v-avatar>
                            <v-overlay 
                            style="cursor: pointer"
                            :model-value="isHovering" 
                            contained scrim="#036358" 
                            @click="this.showPost(post)">
                            </v-overlay>
                        </v-card>
                    </v-hover>
                </div>
            </v-row>
        </v-col>
    </v-container>
    <v-dialog
      v-model="this.modal"
      width="800"
    >
        <overlay-post @showModal=showModal :postContent="selectedPost"></overlay-post>
    </v-dialog>
</template>

<script>
import fetchData from '../../stores/server_routes.js';
import UserStore from '../../stores/UserStore';
import { getImage } from '../../utils/common'
import { ref } from 'vue';
import OverlayPost from './OverlayPost.vue'

const Posts = ref([]);
const selectedPost = ref([]);

export default {
    components: {
        'overlay-post': OverlayPost,
    },
    async setup() {
        let PostsWithImage = await fetchData.methods.fetchData('GET', 'GetAllPostWithImage', null, UserStore.getters.getUserId());
        Posts.value.push(PostsWithImage);
    },
    data() {
        return {
            Posts,
            getImage,
            modal: false,
            selectedPost,

        }
    },
    methods: {
        showPost(post) {
            this.showModal();
            selectedPost.value = post;
        },
        showModal() {
            this.modal = !this.modal;
        }
    }

}
</script>