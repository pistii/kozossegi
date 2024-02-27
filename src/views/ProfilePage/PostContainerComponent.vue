<!-- The container for a single post and the comments section -->
<template>
    <v-card class="mx-auto elevation-6 bg-indigo-lighten-5 my-5"  >
        <v-card-item style="min-width:200px">
            <v-sheet class="d-flex mb-6" color="transparent">
                <v-avatar>
                    <v-img :src="getUserAvatar(postContent.authorAvatar)" />
                </v-avatar>
                <!-- {{ postContent }} -->
                <span>
                    <RouterLink :to="{ path: '/profile=' + postContent.authorId }"
                        class="authorName px-4"
                        >
                        {{ postContent.fullName }}
                    </RouterLink>
                    <v-icon size="17" class="px-2">mdi-timelapse</v-icon>
                    <span class="pl-1 dateFormat">
                        {{ formatDate(postContent.dateOfPost) }}
                    </span>
                </span>

                <v-menu transition="v-fade-transition">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-dots-vertical" class="ml-auto"></v-icon>
                    </template>
                    <v-list>
                        <v-list-item link>
                            <v-list-item-title                             
                            @click="actionHandler(postContent, 'report')">
                                Jelentés
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item link v-if="isAuthor(postContent.authorId)">
                            <v-list-item-title 
                                @click="actionHandler(postContent, 'delete')">
                                Törlés
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-sheet>

            <span v-if="postContent.mediaContents[0] != null" class="justify-center">
                <!--<v-img :src="getFilePath(postContent.mediaContents[0].fileName)"
                    style="max-height: 400px;" 
                    class="text-center" />
                    TODO: disabled to reduce costs    
                --> 
            </span>
            <div v-if="isModifying && modifyingPostIndex === postContent.postId">
                <!--the text is the defaultText which is added by the Szerkesztés button when got the postContent as parameter-->
                <v-textarea auto-grow counter no-resize v-model="defaultText" theme="dark" color="blue"
                    variant="outlined" class="pt-2"></v-textarea>
            </div>
            <v-textarea v-else class="text-caption pt-2" rows="2" max-rows="4" no-resize v-model="postContent.postContent"
                auto-grow theme="dark" bg-color="#528cbb65" disabled>
            </v-textarea>

            <!--Modifications for the post by the author-->
            <v-card-actions class="justify-end pb-0">
                <v-btn 
                size="x-small" 
                variant="plain" 
                class="mr-auto d-flex" 
                v-if="isAuthor(postContent.authorId)" 
                @click="modifyPost(postContent.postContent, postContent.postId)">
                    
                    <span v-if="isModifying && modifyingPostIndex === postContent.postId"
                        @click="saveModyfiedMessage(postContent)">Mentés</span>
                    <span v-else>Szerkesztés</span>
                </v-btn>

                <v-btn size="x-small" variant="plain" class="mr-auto"
                    v-if="isModifying && modifyingPostIndex === postContent.postId"
                    @click="setCommentToDefault(postContent)">Mégse</v-btn>

                <!--like icon-->
                <v-tooltip :text="String(postContent.likes)" location="top">
                    <template v-slot:activator="{ isHovering, props }">
                        <v-btn class="ma-0" variant="text" icon="mdi-thumb-up" :color="isHovering ? undefined : 'primary'"
                            @click="newReaction(postContent.postId, 'like')" v-bind="props"></v-btn>
                    </template>
                </v-tooltip>
                <!--dislike icon-->
                <v-tooltip :text="String(postContent.dislikes)" location="top">
                    <template v-slot:activator="{ isHovering, props }">
                        <v-btn class="ma-0" variant="text" icon="mdi-thumb-down"
                            :color="isHovering ? undefined : 'red-accent-3'" @click="newReaction(postContent.postId, 'dislike')"
                            v-bind="props"></v-btn>
                    </template>
                </v-tooltip>


                <!--comment icon-->
                <v-tooltip :text="String(postContent.postComments.length)" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn class="ma-0" variant="text" icon="mdi-comment" @click="showComments = !showComments" v-bind="props"
                            :color="postContent.postComments.length > 0 ? 'red' : 'default'"></v-btn>
                    </template>
                </v-tooltip>                    
            </v-card-actions>

            <div>
                <v-btn class="pb-0 mb-0" variant="plain" color="primary"
                    v-show="!showWriteCommentBox"
                    @click="showWriteCommentBox = !showWriteCommentBox"
                    >Hozzászólás írása...
                </v-btn>
                <v-textarea 
                    v-show="showWriteCommentBox"
                    v-model="writeComment" 
                    closeable
                    auto-grow 
                    append-inner-icon="mdi-close"
                    @click:append-inner="showWriteCommentBox = !showWriteCommentBox"
                    counter 
                    no-resize 
                    theme="dark" color="blue"
                    variant="outlined" class="pt-2">
                </v-textarea>
                <v-btn 
                v-show="showWriteCommentBox"
                class="justify-end"
                @click="writeCommentToPost(postContent.postId)"
                >
                    Küld
                </v-btn>
                    
            </div>
            <div>
                <v-expansion-panels 
                    :key="postContent.postId"
                    v-if="showComments"
                    >
                    <v-expansion-panel>
                        <PostCommentComponent 
                        :commenter="postContent.postComments" 
                        :postId="postContent.postId" />
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
            <!--todo: as settings option-->
            <!-- <v-sheet color="cyan-lighten-5" :elevation="8" :rounded="true" >
                            <PostCommentComponent 
                                v-if="openedComments.indexOf(index) !== -1 "
                                :commenter="p.postComments"
                            /> 
                        </v-sheet> -->
        </v-card-item>
    </v-card>
</template>

<script>

import store from '../../stores/UserStore';
import { ref } from 'vue';
import PostCommentComponent from './PostCommentComponent.vue'
import fetchData, { PostImage } from '../../stores/server_routes';
import { formatDate, getUserAvatar } from '@/utils/common.js'

var defaultText = ref("");

export default {
    props: {
        postContent: Object,
        index: Number,
    },
    components: {
            PostCommentComponent: PostCommentComponent,
        },
        data() {
            return {            
                isModifying: false,

                openedComments: [],
                modifyingPostIndex : 0,
                //Needed a default text if do not save the comment after all
                commentText: '',
                defaultText,
                selectedFile: null,
                formatDate, getUserAvatar,
                showComments: false,
                showWriteCommentBox: false,
                writeComment: '',

            }
        },
    methods: {
        async newReaction(id, type) { //The like/dislike method
            var data = {
                PostId: id,
                UserId: store.getters.getUserId(),
                actionType: type,
            }
            var resp = await fetchData.methods.fetchData('PUT', 'action', data); //Backend returns one of 4 condition of action types
            
            this.postContent.likes = resp.likes;
            this.postContent.dislikes = resp.dislikes
            this.postContent.userReaction = resp.userReaction;

        },
        modifyPost(text, postId) {
            this.modifyingPostIndex = postId
            this.isModifying = !this.isModifying;

            this.commentText = text
            this.defaultText = text
        },
        setCommentToDefault() {
            this.isModifying = !this.isModifying;
            this.commentText = this.defaultText
        },
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async saveModyfiedMessage(param) {
            // var data = {
            //     SourceId: this.modifyingPostIndex,
            //     userId: store.state.userId,
            //     PostContent: defaultText.value
            // }
            //var postContent = postContent.find(post => post.postId == id); //finds the post where the id equals and returns only the specified post
            param.postContent = defaultText.value
            let data = new FormData();
            data.append('SourceId', this.modifyingPostIndex);
            data.append('userId', store.state.userId);
            data.append('PostContent', defaultText.value);
            if (this.selectedFile) {
                data.append('Name', this.selectedFile.name); 
                data.append('Type', this.selectedFile.type);
                data.append('File', this.selectedFile);
            }
            console.log(data)

            await PostImage('PUT', 'putPost', data, this.modifyingPostIndex);
        },

        async writeCommentToPost(postId) {
            if (this.writeComment != '') {
                let data = {
                    postId: postId,
                    commenterId: store.getters.getUserId(),
                    commentTxt: this.writeComment
                }

                var resp = await fetchData.methods.fetchData('POST', 'newComment', data);
                if (resp != null) {
                    this.showWriteCommentBox = false;
                    let message = resp;
                    this.postContent.postComments.push(message);
                }
            }
        },
        async actionHandler(post, actionType) {
            console.log(post)
            if (actionType === 'delete') { 
                if (store.state.userId == post.authorId) {
                    await fetchData.methods.fetchData('DELETE', "DeletePost", post.postId).then(rep => console.log(rep));
                }
            } else if (actionType === 'report') {
                console.log("Jelentés létrehozása...") //TODO
            }
        },
        isAuthor(authorId) {
            return authorId == store.state.userId ? true : false
        },
        getFilePath(path) {
            const IMAGES_URL = "pb_imgs"
            return  "https://storage.googleapis.com/" + IMAGES_URL + "/" + path;
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