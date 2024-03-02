<template>
	<a href="javascript:void(0)" class="pa-1">
		<v-menu :close-on-content-click="true" :absolute="true" width="400" scroll-strategy="none">
			<template v-slot:activator="{ props }" >
				<v-badge 
					class="pa-1"
					:color="newNotificationReceived > 0 ? 'error' : 'transparent'"
					:content="newNotificationReceived>0 ? newNotificationReceived : undefined" >
					<v-icon v-bind="props"  @click="getNotifications()">mdi-bell</v-icon>
				</v-badge>
			</template>

			<v-list  v-for="item in notificationMenuItems[0]" bg-color="blue-lighten-5">
				<!-- {{ item }} -->

				<!-- create new friend request notification message-->
				
				<v-list-item 
				@click="clickedOnNotification(item.notificationId, item.isNew)" 
				:prependAvatar="getUserAvatar(item.notificationAvatar)" 
				class="elevation-5 mx-1 text-truncate "
				>
				<template v-slot:append v-if="item.isNew">
					<v-icon color="green"> mdi-circle-medium </v-icon> 
				</template>

				<div class="w-100">
					<span class="text-start text-caption">
						{{ this.formatDate(item.createdAt) }}
					</span>
					<span class="pl-2">
						{{ item.notificationContent }}
					</span>

					<!--
						FriendRequest = 0,
						FriendRequestAccepted = 1,
						Birthday = 2,
						NewPost = 3
					-->
				</div>
					<v-list-item-title v-if="item.notificationType === 0" > <!--Csak akkor jelenik meg, ha barát kérelem történt--> 
						
						<v-sheet class="text-right" color="transparent">
							<v-btn 
							density="compact" 
							color="deep-purple" 
							class="px-1 my-1" 
							size="small" 
							height="20" 
							@click="confirmRequest(item)" 
							text="Megerősít"/>
							<v-btn density="compact" 
							class="ml-3 px-1"    
							size="small"
							height="20"
							color="grey-lighten-2" 
							@click="rejectRequest(item)" text="Elutasít"/>
						</v-sheet>
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
	</a>
</template>

<script>
import { isLoggedin } from '@/utils/auth.js';
import store from '@/stores/UserStore';

export default {
	computed: {
		newNotificationReceived() {
            return store.getters.getNotifications().length
        }
	},
	data() {
		return {
			notificationMenuItems: []
		}
	},
	methods: {
		async getNotifications() {
            if (isLoggedin() && this.userId > 0) {
                try {
                    await fetchData.methods.fetchData('GET', 'GetNotifications', null, this.userId)
                    .then(resp => notificationMenuItems.value.push(resp));
                } catch (error) {
                    console.error('Error while getting notifications:', error);
                }
            }
        },
        async clickedOnNotification(id, isNew) {
            if (isNew)
            {
                //await fetchData.methods.fetchData('GET', 'NotificationRead', null, id).then(response => console.log(response));
            }
        },		
        async confirmRequest(notification) { 
            const postData = {
                UserId: store.getters.getUserId(),
                FriendId: notification.notificationFrom,
                NotificationId: notification.notificationId
            }
            var resp = await fetchData.methods.fetchData('POST', 'AcceptFriendRequest', postData) 

            var notificationToModify = notificationMenuItems.value[0].find(n => n.notificationId === resp.notificationId);
            notificationToModify.notificationContent = resp.notificationContent;
            notificationToModify.isNew = resp.isNew;
        },
        rejectRequest(notification) { //todo: test this function
            console.log("reject")//todo
            
        },
	}
}
</script>