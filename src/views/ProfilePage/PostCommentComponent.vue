<!--uses this the centerContent
    This is the component for the comments
-->
<template>
    <v-container  > 
        <div class="pb-2" v-for="post in commenter" :key="post">
            <v-card class="mx-auto " color="cyan-lighten-4">
                    <v-avatar class="ma-2">
                        <img  :src="post.commenterAvatar || '/src/assets/imgs/blank_profile_pic.png'" height="40"/>     
                    </v-avatar>
                   <span>
                       <a :href="'profile=' + post.authorId" class="authorName router-link router-link-active"> 
                        {{ post.commenterFirstName }} {{ post.middleFirstName }} {{ post.commenterLastName }}
                       </a>
                       {{ this.getPassedTime(post.commentDate) }}
                       <v-tooltip text="modify/edit" location="start">
                           <template v-slot:activator="{ props }">
                               <v-icon  v-bind=props icon="mdi-dots-vertical" size="15" @click="modifyPostTextBtn()"></v-icon>
                           </template>
                       </v-tooltip>
                       
                   
                    <v-card-text class="pt-0 pb-0">
                        {{ post.commentText }}
                    </v-card-text>
                <v-card-actions class="d-flex justify-end">

                    <b v-on:click="likeComment(post.commentId)" class="mx-1 post_action"> Like</b>
                    <b v-on:click="dislikeComment(post.commentId)"
                    class="mx-1 post_action"> Dislike</b>
                    <b v-on:click="createComment(post.commentId)"
                    class="ml-1 post_action"> Hozzászólás</b>
                    
                </v-card-actions>
            </span>
            </v-card>
            {{ post }}
            <v-btn class="pb-0 mb-0" variant="plain" color="primary"
                @click="this.writeCommentInPost(postId)"
                    >Hozzászólás írása...
            </v-btn>
        <a v-if="this.hasMoreComment">További hozzászólások betöltése...</a>
        </div>
    </v-container>
</template>

<script>
import { RouterLink } from 'vue-router';
import { getPassedTime } from '@/utils/common.js'

export default {
    props: {
        commenter: Array,
        postId: Number,

    },
    components: { RouterLink },
    data () {
        return {
            hasMoreComment: false,
            getPassedTime,

        }
    },
    methods: {
        likeComment(commentId) {
            console.log("liked" + commentId);
            //Todo: send the like 
        },
        dislikeComment(commentId) {
            console.log("dislike" + commentId);
            //Todo: send the dlike 

        },
        createComment(commentId) {
            console.log("comment" + commentId);
            //Todo: send the comment 
        },
        writeCommentInPost(postId) {
            console.log(postId);
        },
    }
}
</script>


<style scoped>
.authorName {
    color: #528cbbef; 
    font-family:'Franklin Gothic Medium'; 
    text-decoration: none;
}
</style>

<style>
.post_action {
    position: relative;
    overflow: hidden;
    border-radius: 20vw;
    cursor: pointer;
}
.post_action::before {
    
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #528cbb65;
    opacity: 0;
    transition: width 1s ease-out, height 1s ease-out, opacity 1s ease-out;
}
.post_action:hover::before {
    width: 200%;
    height: 200%;
    opacity: 1;
    transition: width 1s ease-out, height 1s ease-out, opacity 1s ease-out;
}

</style>