<template>
    <div v-if="errorThrown">
        <v-container>
            <v-card class="px-3 py-3">
                <v-card-text>
                    Váratlan hiba történt a post tartalmak betöltésekor. Próbáld újra később, vagy kattints a gombra és próbáld újra.
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn rounded @click="loadMorePosts()" icon="mdi-restart" class="bg-blue-grey-lighten-4"></v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </div>
    <div v-for="(p, index) in postok" v-if="!errorThrown">
        <v-sheet min-height="250" class="fill-height" color="transparent">
            <post :postContent="p" :index="index"></post>
        </v-sheet>
    </div>
    <Observer @intersect="handleIntersection" 
        :options="{ threshold: 0.8 }" />
</template>

<script>
import PostCommentComponent from './PostCommentComponent.vue';
import PostContainerComponent from './PostContainerComponent.vue';
import fetchData from '@/stores/server_routes';
import { ref } from 'vue';
import Observer from '@/components/Observer.vue'
import store from '@/stores/UserStore';
import { useRoute } from 'vue-router';
import { formatDate } from '@/utils/common.js'

var defaultText = ref("");
let errorThrown = ref(false);
var currentPage = ref(1);
var postok = ref([]);
export default {
    props: {
        totalPages: Number,
        posts: Array
    },
    components: {
        PostCommentComponent: PostCommentComponent,
        Observer,
        'post': PostContainerComponent,
    },
    setup(props) {
        postok.value = props.posts
        const route = useRoute()
        const hasMoreItems = ref(props.totalPages == 1 ? false : true);

        const loadMorePosts = async () => {
            if (!hasMoreItems.value) {
                return;
            }
            if (props.totalPages > currentPage.value) {
                try {
                    currentPage.value++;
                    console.log(currentPage.value);
                    var profileId = route.params.id ?? store.state.userId;
                    let userId =  store.getters.getUserId();
                    const newPosts = await fetchData.methods.fetchData('GET', "GetAllPost", null, profileId, userId, currentPage.value);
                    
                    postok.value.push(...newPosts.data);
                    //console.log(postok.value)
                    if (newPosts.length === 0) 
                        hasMoreItems.value = false;

                    errorThrown.value = false;
                }
                catch (error) {
                    //console.log("Hiba történt a postok beolvasásakor: " + error);
                    errorThrown.value = true;
                }
            }
        };
    
        const handleIntersection = () => {
            loadMorePosts();
    };

    return {
      handleIntersection,
      hasMoreItems,
      loadMorePosts,
    };
    },
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
            errorThrown,
        }
    },
    methods: {
        ShowComments(index) {
            
            console.log(index)
            if (this.openedComments.includes(index)) {
                // Bezárja a hozzászólásokat újra kattintásnál
                this.openedComments = this.openedComments.filter(item => item !== index);
            } else {
                // Megnyitja az adott hozzászólást
                this.openedComments.push(index);
            }
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
.custom-menu {
    text-align: right;
}

.v-input__control, .v-field--disabled {
    color: #000000 !important;
    
}

.v-field__overlay {
    color: #000000 !important;
}

.dateFormat {
    font-family:serif;
    color: rgb(57, 57, 57);
}
</style>