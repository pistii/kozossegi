<template>
    <v-row justify="center">
        <v-card class="mx-auto elevation-6" style="min-width:40vw" > 
                <v-card-item >
                    <v-sheet class="d-flex mb-6" color="transparent">
                        <v-avatar>
                            <v-img :src="getUserAvatar(postContent.authorAvatar)" />
                        </v-avatar>
                        
                        <span>
                            <span @click=navigateToUser(postContent.authorId)
                                class="pa-3 pt-2 onHover" 
                                style="color: #528cbbef; font-family:'Franklin Gothic Medium'; text-decoration: none;"
                            >{{ postContent.fullName }}
                            </span>
                            <v-icon size="17" class="px-2">mdi-timelapse</v-icon>
                            <span class="pl-1 dateFormat">
                                {{ formatDate(postContent.dateOfPost) }}
                            </span>
                        </span>
                        
                        <v-menu transition="v-fade-transition" >
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-dots-vertical" class="ml-auto"></v-icon>
                            </template>
                            <v-list>
                                <v-list-item link>
                                    <v-list-item-title  @click="actionHandler(postContent, 'report')">
                                        Jelentés
                                    </v-list-item-title >
                                </v-list-item>
                                <v-list-item link v-if="isAuthor(postContent.authorId)" >
                                    <v-list-item-title @click="actionHandler(postContent, 'delete')" >
                                    Törlés
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-sheet>
                    
                    <span v-if="postContent.mediaContents[0] != null" class="justify-center" rounded >
                        <v-img :src="getFilePath(postContent.mediaContents[0].fileName)" 
                            class="text-center"/> 
                    </span>
                    <v-card-item class="px-0">
                        <div  v-if="isModifying && modifyingPostIndex === p.postId">
                            <!--the text is the defaultText which is added by the Modify button when got the postContent as parameter-->
                            <v-textarea
                            rows="auto"
                            counter
                            no-resize
                            v-model="defaultText" 
                            theme="dark" 
                            color="blue" 
                            variant="outlined" 

                            ></v-textarea>
                        </div>

                        <v-textarea v-else 
                        class="text-caption" 
                        rows="2" max-rows="4" 
                        no-resize 
                        v-model="postContent.postContent" 
                        auto-grow 
                        theme="dark" 
                        bg-color="#528cbb65" 
                        disabled
                        >
                        </v-textarea>
                    </v-card-item>
                    <!--Modifications for the post by the author-->
                    <v-card-actions  class="justify-end pb-0">
                        <v-btn size="x-small" 
                            variant="plain" 
                            class="mr-auto d-flex" 
                            v-if="isAuthor(postContent.authorId)"
                            @click="modifyPost(postContent.postContent, postContent.postId)"
                            >

                            <span v-if="isModifying && modifyingPostIndex === postContent.postId" 
                                @click="saveModyfiedMessage(postContent.postId)">
                                Mentés
                            </span>
                            <span v-else >Szerkesztés</span>
                        </v-btn>
                        <v-btn 
                            size="x-small" 
                            variant="plain" 
                            class="mr-auto" 
                            v-if="isModifying && modifyingPostIndex === postContent.postId"
                            @click="setCommentToDefault(postContent.postContent)"
                        >Mégse</v-btn>
                        <!--like icon-->
                        <v-tooltip :text="String(postContent.likes)" location="top">
                            <template v-slot:activator="{ isHovering, props }">
                                <v-btn
                                    class="ma-0" 
                                    variant="text"
                                    icon="mdi-thumb-up"
                                    :color="isHovering ? undefined : 'primary'"
                                    @click="LikeComment(postContent.postId)"
                                    v-bind="props"
                                ></v-btn>
                            </template>
                        </v-tooltip>
                        <!--dislike icon-->
                        <v-tooltip :text="String(postContent.dislikes)" location="top">
                            <template v-slot:activator="{ isHovering, props }">
                                <v-btn
                                    class="ma-0"
                                    variant="text"
                                    icon="mdi-thumb-down"
                                    :color="isHovering ? undefined : 'red-accent-3'"
                                    @click="DisLikeComment(postContent.postId)"
                                    v-bind="props"
                                ></v-btn>
                            </template>
                        </v-tooltip>
                    
                        
                        <!--comment icon-->
                        <v-tooltip :text="String(postContent.postComments.length)" location="top">
                            <template v-slot:activator="{ props }">
                                <v-btn
                                    class="ma-0"
                                    variant="text"
                                    icon="mdi-comment"
                                    @click="ShowComments()"
                                    v-bind="props"
                                    :color="postContent.postComments.length > 0 ? 'red' : 'default'"
                                ></v-btn>
                            </template>
                        </v-tooltip>

                    </v-card-actions> 

                    <div>
                        <v-expansion-panels v-if="openedComments !== -1 "
                        v-model="this.openedComments"
                        >
                            <v-expansion-panel>
                                <PostCommentComponent :commenter="postContent.postComments" :postId="postContent.postId" />
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
    </v-row>
</template>

<script>
import store from '../../stores/UserStore';
import { ref } from 'vue';
import PostCommentComponent from './PostCommentComponent.vue'
import fetchData from '../../stores/server_routes';
import { formatDate, getUserAvatar } from '@/utils/common.js'


var currentPage = ref(1);
var defaultText = ref("");

var postok = ref([]);

    export default {
        props: {
            postContent: Object,
        },
        components: {
            PostCommentComponent: PostCommentComponent,
        },
        setup() {
            //console.log("opened")
        },
        emits: ['showModal'],
        data() {
            return {            
                isModifying: false,

                openedComments: [],
                modifyingPostIndex : 0,
                //Needed a default text if do not save the comment after all
                commentText: '',
                defaultText,

                postok,
                formatDate,
                getUserAvatar,

            }
        },
        methods: {
            async LikeComment(id) {
            var data = {
                postId: id,
                doLike: true,
                isIncrement: true
            }
            await fetchData.methods.fetchData('PUT', 'action', data);
            
        },
        async DisLikeComment(id) {
            var data = {
                postId: id,
                doLike: false,
                isIncrement: true
            }
            await fetchData.methods.fetchData('PUT', 'action', data);
        },
        ShowComments() {
            
            console.log(index)
            
                // // Bezárja a hozzászólásokat újra kattintásnál
                // this.openedComments = this.openedComments.filter(item => item !== index);
            
                // Megnyitja az adott hozzászólást
                this.openedComments.push(postContent.postComments);
            
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
        async saveModyfiedMessage(id) {
            var data = {
                SourceId: this.modifyingPostIndex,
                userId: store.state.userId, //TODO: Check if it valid because had been modified without test
                PostContent: defaultText.value
            }
            var postContent = postok.value.find(post => post.postId == id); //finds the post where the id equals and returns only the specified post
            postContent.postContent = defaultText.value
            //console.log(postContent)

            await fetchData.methods.fetchData('PUT', "putPost", data).then(resp => console.log(resp))
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
        navigateToUser(userId) {
            this.$emit('showModal', false)
            this.$router.push('/profile=' + userId)
        }
        }

    }
</script>