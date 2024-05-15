<template>
    <div :style="{ height: containerHeight + 'px' }" 
    class="bg-blue-lighten-4">    
    
        <ChatCardWidgetHeader @setChatContainerHeight="setChatContainerHeight"/>
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
    data() {
        return {
            containerHeight : undefined,
        }
    },

    components: {
        ChatCardWidgetHeader,
        ChatCardWidgetBody,
        ChatCardWidgetFooter
    },
    methods: {
        setChatContainerHeight(size) {
            this.containerHeight = size;
        }
    }
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

</style>