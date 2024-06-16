<template>
    <div :style="{ maxHeight: containerHeight + 'px' }" 
    class="bg-blue-lighten-4 elevation-11">    
        
        <ChatCardWidgetHeader @setChatContainerHeight="setChatContainerHeight" />
        
        <v-row >
            <ChatCardWidgetBody style="max-width: 324px;" />
        </v-row>  
        <ChatCardWidgetFooter :userId="activeUser?.user?.id"/>
    </div>
</template>

<script>
import ChatCardWidgetHeader from './ChatCardWidgetHeader.vue';
import ChatCardWidgetBody from './ChatCardWidgetBody.vue';
import ChatCardWidgetFooter from './ChatCardWidgetFooter.vue';
import MessageStore from '@/stores/MessageStore.js';

export default {
    data() {
        return {
            containerHeight : 420,
        }
    },
    components: {
        ChatCardWidgetHeader,
        ChatCardWidgetBody,
        ChatCardWidgetFooter,
    },
    computed: {
        activeUser() {
            return MessageStore.getters.getActiveChat();
        },
    },
    methods: {
        setChatContainerHeight(size) {
            this.containerHeight = size;
        },
    },
    
}
</script>

<style scoped>
.overlayContainer {
    bottom: 0;
    z-index: 10000;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

</style>