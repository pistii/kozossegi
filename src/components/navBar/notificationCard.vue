<template>
    <v-list-item 
    @click="clickedOnNotification(notification.notificationId, notification)" 
    :prependAvatar="getUserAvatar(notification.notificationAvatar)" 
    class="elevation-5 mx-1 pa-1 text-truncate "
    >

        <template v-slot:append v-if="notification.isNew">
            <v-icon color="green"> mdi-circle-medium </v-icon> 
        </template>

        <div class="w-100">
            <span class="text-start text-caption">
                {{ formatDate(notification.createdAt) }}
            </span>
            <span class="pl-2">
                {{ notification.notificationContent }}
            </span>

        </div>
        <v-list-item-title v-if="notification.notificationType === 0" > <!--Csak akkor jelenik meg, ha barát kérelem történt--> 
            <v-sheet class="text-right" color="transparent">
                <v-btn 
                density="compact" 
                color="deep-purple" 
                class="px-1 my-1" 
                size="small" 
                height="20" 
                @click="confirmRequest(notification)" 
                text="Megerősít"/>

                <v-btn density="compact" 
                class="ml-3 px-1"    
                size="small"
                height="20"
                color="grey-lighten-2" 
                @click="rejectRequest(notification)" text="Elutasít"/>
            </v-sheet>
        </v-list-item-title>
    </v-list-item>
</template>

<script setup>
import { getUserAvatar, formatDate } from '@/utils/common';
import store from '@/stores/UserStore';
import fetchData from '@/stores/server_routes.js'
const props = defineProps({
    notification: Object,
});

async function PutFriendRequest(data) {
    var resp = await fetchData.methods.fetchData('PUT', 'AcceptFriendRequest', data); 
    if (resp !== null) {
        if (data.StatusId === 4) {
            props.notification.notificationContent = "Ismerős kérelem elutasítva.";
            props.notification.isNew = false;
        }
        else if (data.StatusId == 1) {
            props.notification.notificationContent = "Mostantól ismerősök vagytok.";
            props.notification.isNew = false;
        }
    }
}

async function confirmRequest(notification) { 
    const postData = {
        UserId: store.getters.getUserId(),
        FriendId: notification.senderId,
        StatusId: 1, //Friends
        NotificationId: notification.notificationId
    }
    await PutFriendRequest(postData);
}


async function rejectRequest(notification) { 
    const postData = {
        UserId: store.getters.getUserId(),
        FriendId: notification.senderId,
        StatusId: 4, //Reject
        NotificationId: notification.notificationId
    }
    await PutFriendRequest(postData);
}

async function clickedOnNotification(id, noti) {
    if (noti.isNew)
    {
        var respNoti = await fetchData.methods.fetchData('GET', 'NotificationRead', null, id);
        if (respNoti !== null) {
            props.notification.isNew = false;
        }
    }
}
</script>