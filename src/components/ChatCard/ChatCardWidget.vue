<template>
    <div :style="{ maxHeight: containerHeight + 'px' }" 
    class="bg-blue-lighten-4 elevation-11">    
        
        <ChatCardWidgetHeader @setChatContainerHeight="setChatContainerHeight" :userInfo="this.open" />
        
        <v-row >
            <ChatCardWidgetBody style="max-width: 324px;" />
            
        </v-row>  
        <ChatCardWidgetFooter />
    </div>
</template>

<script>
import ChatCardWidgetHeader from './ChatCardWidgetHeader.vue';
import ChatCardWidgetBody from './ChatCardWidgetBody.vue';
import ChatCardWidgetFooter from './ChatCardWidgetFooter.vue';

export default {
    props: {
        open: Object
    },
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
    methods: {
        setChatContainerHeight(size) {
            this.containerHeight = size;
        },
    },
    
}
</script>

<style>


.overlayContainer {
    bottom: 0;
    z-index: 10000;
}

.panelNavHeader {
    border-radius: 30px;
    max-height: 25px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
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