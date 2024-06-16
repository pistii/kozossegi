<template>
    <div :key="counter">
        <video width="200" height="160" autoplay controls>
            <source :src="url" type="video/mp4">
        </video>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import {base64ToBlob, blobToUrl} from '@/utils/common.js';
import fetchData from '@/stores/server_routes';

var url = ref(null);
var counter = ref(0);

export default {
    props: {
        video: Object,
        base64ToBlob, blobToUrl,
    },
    data() {
        return {
            url,
            counter,
        }
    },
    setup(props) {

    onMounted( async () => {       
        function base64ToBlob(base64, mimeType) {
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: mimeType });
        }

        if (props?.video?.fileData) {
            const base64String = props.video.fileData;
            var mimeType = props.video.fileType;
            const blob = base64ToBlob(base64String, mimeType);
            var mediaBlob = URL.createObjectURL(blob);
            url.value = mediaBlob;
        }
        else if (props?.video?.fileToken) {
            let baseAudio = await fetchData.methods.fetchData('GET', 'GetFile', null, props?.video?.fileToken);
            const blob = base64ToBlob(baseAudio, mimeType);
            var mediaBlob = URL.createObjectURL(blob);
            url.value = mediaBlob;
        }
        counter.value++;
        });
    }
}
</script>