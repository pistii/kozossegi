<template>
    <v-card v-for="(post, n) in posts" :key="n" class="mx-auto" max-width="344" variant="outlined">
        <v-card-item style="min-width:200px">
            <div v-for="(p, n) in post" :key="n">
                <div>
                    <v-sheet class="d-flex mb-6">
                        <img :src="p.authorAvatar" />
                        <RouterLink class="pt-3 pl-3" :to="{ path:'/profile='+p.authorId }">{{ p.fullName }}</RouterLink>
                    </v-sheet>
                    <div class="text-right text-top">
                        <v-tooltip text="modify" location="start">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind=props icon="mdi-dots-vertical" @click="modifyPostTextBtn()"></v-icon>
                            </template>
                        </v-tooltip>
                    </div>
                    <div v-if="isModifying">
                        <v-textarea
                        rows="3"
                        counter
                        :readonly="isReadonly"
                        no-resize
                        :rules="rules"
                        v-model="p.postContent"
                        ></v-textarea>
                    </div>
                    <div v-else class="text-caption" >{{ p.postContent }}</div>
                    <v-btn size="x-small" 
                        variant="plain" 
                        class="mr-auto" 
                        @click="modifyPost(p.postContent)">
                        <span v-if="!isModifying">Szerkesztés</span>
                        <span v-else @click="putPostMessage()">Mentés</span>
                    </v-btn>
                    <v-btn 
                        size="x-small" 
                        variant="plain" 
                        class="mr-auto" 
                        v-if="isModifying"
                        @click="setCommentToDefault()"
                    >Mégse</v-btn>
                                
                    <v-card-actions class="justify-end">
                        <Like @click="LikeComment()"/>
                        <Like class="ml-3 dislike_svg" @click="DisLikeComment()" />
                        <Comment class="ml-3" @click="ShowComments()"/>
                    </v-card-actions>

                </div>
            </div>
        </v-card-item>
        <PostCommentComponent v-if="showComments"
                :commenter="posts[0][0].postComments"/>
    </v-card>
</template>

<script>
import LikeSVG from '../assets/imgs/LikeSVG.vue';
import Comment from '../assets/imgs/Comment.vue';
import PostCommentComponent from './PostCommentComponent.vue';
import { fetchData } from '../stores/server_routes.js';
import { ref } from 'vue';

var posts = ref([]);
export default {
    async created() { //load the data
        await fetchData('GetAllPost') //Todo: get by userId
            .then(value => {
                posts.value.push(value);
                console.log(value)
                console.log(posts.value[0][0].postComments);

            });
    },
    components: {
        Like: LikeSVG, //svg
        Comment : Comment, //SVG icon
        PostCommentComponent: PostCommentComponent,
    },
    data() {
        return {
            posts,
            showComments: false,
            commenterAvatar: '',
            commenterFullName: '',
            commentText: '',
            defaultText: '',
            commenterId: 0,
            isReadonly: true,
            isModifying: false,
            postText: ''
        }
    },
    methods: {
        LikeComment() {
            console.log("liked");
        },
        DisLikeComment() {
            console.log("disliked");
        },
        ShowComments() {
            this.showComments = !this.showComments;
        },
        modifyPostTextBtn() {
            console.log("modify text")
        },
        modifyPost(text) {
            this.isReadonly = !this.isReadonly;
            this.isModifying = !this.isModifying;
            this.commentText = text
            if (this.defaultText === '')
                this.defaultText = text
        },
        setCommentToDefault() {
            this.isModifying = !this.isModifying;
            this.commentText = this.defaultText
        },
        putPostMessage() {
            //Todo: send the request....
        }
    }
}
</script>

<style>
.commentsContainer {
    display: inline-block;
}
.comment_profile_pic {
    width: 100px;
    height: 100px;
}

.dislike_svg {
    transform: rotate(180deg);
}
</style>