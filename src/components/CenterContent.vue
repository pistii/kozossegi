<template>
    <v-card class="mx-auto" max-width="344" variant="outlined">

        <v-card-item>

            <div>
                <v-sheet class="d-flex mb-6 ">
                    <div class="text-overline mx-1">
                        Gipsz Jakab
                    </div>
                </v-sheet>
                <div class="text-caption">Something probably enough long senctence what Gipsz Jakab wrote</div>

            </div>
        </v-card-item>
        <v-card-actions>
            <Like  />
            <Like class="dislike_svg" />
            <Comment />
        </v-card-actions>


    </v-card>
</template>

<script>
import LikeSVG from './LikeSVG.vue';
import Comment from './Comment.vue';
export default {
    components: {
        Like: LikeSVG,
        Comment : Comment
    },
    data() {
        return {
        }
    }
}
</script>

<style>
.comment_profile_pic {
    width: 100px;
    height: 100px;
}

.dislike_svg {
    transform: rotate(180deg);
}
</style>