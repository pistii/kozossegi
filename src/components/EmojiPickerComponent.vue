<template>
    <EmojiPicker 
        v-if="EmojiVisible" 
        @emoji_click="handleEmojiClick" />
        <v-icon 
        class="px-6 py-3 mb-2"
        @click="onEmojiPicker">mdi-emoticon</v-icon>
</template>

<script>
import EmojiPicker from '@/views/Message/MessagePage/EmojiPicker.vue'
import emojiJsonData from '@/emojis-data.json'

export default {
    props: {
        activeMenu: String
    },
    emits: ['selectedEmoji'],
    data() {
        return {
            EmojiVisible: false,
            
            'Frequently used': {
                emojiname: ''
            },
        }
    },
    components: {
        EmojiPicker,
    },
    methods: {
        onEmojiPicker() {
            if (this.activeMenu == 'text')
                this.EmojiVisible = !this.EmojiVisible;
            if (this.activeMenu == 'audio' && this.EmojiVisible) {
                this.EmojiVisible = false;
            }
        },
        handleEmojiClick(emoji) {
            this.$emit('selectedEmoji', emoji); //Notify the Card Footer component about the added emoji
            var keys = Object.keys(emojiJsonData['Frequently used'])
            var items = Object.entries(emojiJsonData);
            
            //Todo: Store the recently used emojis in store
            items[0][1]["emoji"] = emoji
            for (var i = 0; i < items.length; i++) {
                for (let key in items[i]) {
                    items.keys += emoji
                }
            }
            this.EmojiVisible = false;

        },
    }
}
</script>

<style scoped>
.emoticon {
    cursor: pointer;
    right: 0;
    height: 17px;
}
</style>