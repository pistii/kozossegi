<template>
    <v-container fluid >
        <div class="pb-2" v-for="post in commenter">
            <v-card class="mx-auto px-5">
                <v-card-header>
                    <img class="commenter_profile_pic" :src="post.commenterAvatar" />
                    <span>
                        <a :href="'profile=' + post.authorId" class="router-link router-link-active"> {{ post.commenterFullName }}
                        </a>
                        <v-tooltip text="modify/edit" location="start">
                            <template v-slot:activator="{ props }">
                                <v-icon  v-bind=props icon="mdi-dots-vertical" @click="modifyPostTextBtn()"></v-icon>
                            </template>
                        </v-tooltip>
                        <v-card-text class="pt-0 pb-0">
                            {{ post.commentText }}
                        </v-card-text>
                    </span>
                </v-card-header>
                <v-card-footer class="d-flex justify-end">
                    <span class="mx-1"> Like</span>
                    <span class="mx-1"> Dislike</span>
                    <span class="ml-1"> Hozzászólás</span>
                </v-card-footer>
            </v-card>
        </div>
        <a>További hozzászólások betöltése...</a>
    </v-container>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
    props: {
        commenter: Array
    },
    components: { RouterLink }
}
</script>

<style>
.commenter_profile_pic {
    border-radius: 50%;
}

</style>