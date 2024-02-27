<template>
        <div class="textarea-container bg-blue-lighten-3">
            <v-textarea v-model="msgBox" 
            color="blue-lighten-3" bg-color="blue-lighten-2"
            rounded="xl" placeholder="Van valami mondani valód?"
            @click="textareaEnter()"
            >
            
            </v-textarea>
            <div class="d-flex">
                <transition name="fade-in" >
                        <v-file-input v-if="clickedIntoInput"
                        prepend-icon="mdi-camera"
                        accept="image/*"
                        ref="fileInput"
                        @change="handleFileChange" 
                        class="w-50 imageUpload pl-2"
                    >
                    </v-file-input>
                </transition>
                
                <div class="text-right ml-auto">
                    <v-btn 
                        color="blue"
                        class="custom-button text-none" 
                        @click="!this.msgBox || CreatePost()">Küldés
                    </v-btn>
                </div>
            </div>
            <div class="text-right">
                <transition name="bounce" >
                    <div v-if="showResult"><b style="color:rgb(130, 231, 130)">{{ response }}</b></div>
                </transition>
            </div>
            <v-divider color="white" thickness="2">
            </v-divider>
        </div>
</template>
  
<script>
import { PostImage } from '@/stores/server_routes';
import store from '@/stores/UserStore';
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const route = ref(null);
export default {
    data() {
        return {
            msgBox: "",
            route,
            response: '',
            showResult: false,
            clickedIntoInput: false,

            selectedFile: null,
        };
    },
    created() {
        route.value = useRoute()
    },
    methods: {
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        textareaEnter() {
            this.clickedIntoInput = true;
        },
        teaxtareaLeave() {
            this.clickedIntoInput = false;
        },
        async CreatePost() {
            var userId = store.state.userId
            const routeId = route.value.params.id;
            
            var data = new FormData();
            data.append('SourceId', userId);
            data.append('userId', routeId);
            data.append('PostContent', this.msgBox);
            if (this.selectedFile) {
                data.append('Name', this.selectedFile.name); 
                data.append('Type', this.selectedFile.type);
                data.append('File', this.selectedFile);
            }
            console.log(data)
            await PostImage('POST', 'CreateNewPost', data)
                .then(resp => resp ? 
                this.$emit('posts', resp) : 
                "Valami hiba történt, próbáld újra később..."); 
            this.showResult = true;
            this.msgBox = ""
            this.selectedFile = null;
        },
        posted() {
            this.response = "A posztod közzétéve.";
            //TODO: response back to the 
            this.$emit('posts', resp)
        }
    }
};
</script>

<style>
.textarea-container {
    border-radius: 10px;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    border-left: 1px solid white;
}

.textarea {
    width: 100%;
    height: 200px;
    padding: 10px;
    max-height:200px;

}

.custom-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
}

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.fade-in-enter-active, .fade-in-leave-active {
    animation: fadein 1s;
}

@keyframes fadein {
    from {
      opacity: 0;
      translate: 0 -50px;
    }
    to {
      opacity: 1;
      translate: 0 0;
    }
  }
.fade-in-enter, .fade-in-leave-to {
  opacity: 0;
}

.imageUpload {
    height: 25%; 
    display: contents;
    z-index: 9999;
}

.imageUpload .v-input__control {
    display: none;
}
</style>