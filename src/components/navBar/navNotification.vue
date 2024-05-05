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
			<v-sheet v-if="notfound" class="text-center pa-1">
				Hoppá... Nem található tartalom
				<v-img src="/src/assets/sed.gif">
				</v-img>
			</v-sheet>
			
			<v-sheet v-else class="scrollbar scroll_panel onlineUsersContainer" height="300">
				<v-overlay 
				v-model="loading"
				class="align-center justify-center"
				contained>
				<v-progress-circular
						color="primary"
						indeterminate
						size="64"
						class="py-9 align-center justify-center"
							>
					</v-progress-circular>
				</v-overlay>
				<div 
					v-for="item in notificationMenuItems" 
					bg-color="blue-lighten-5">

					<notificationCard :notification="item"/>
				</div>

				<div>
					
					<Observer @intersect="loadMoreNotification" 
					:options="{ threshold: 0.8 }" />
				</div>
				
        	</v-sheet>

		</v-menu>
	</a>
</template>

<script>
import { isLoggedin } from '@/utils/auth.js';
import store from '@/stores/UserStore';
import fetchData from '@/stores/server_routes.js';
import { getUserAvatar, formatDate } from '@/utils/common';
import { ref } from 'vue'
import notificationCard from './notificationCard.vue'
import Observer from '@/components/Observer.vue'

//Notification Types:
/*FriendRequest = 0,
FriendRequestAccepted = 1,
Birthday = 2,
NewPost = 3
*/

var notfound = ref(false);
var notificationMenuItems = ref([]);
var currentPage = ref(1);
var loading = ref(false);

export default {
	components: {
		notificationCard,
		Observer,
	},
	computed: {
		newNotificationReceived() {
			console.log("Értesítésk száma: " +  store.getters.getNotifications().length)
            return store.getters.getNotifications().length
        }
	},
	data() {
		return {
			notfound,
			notificationMenuItems,
			currentPage,			
			loading,

			isLoggedin,
			getUserAvatar, formatDate,
		}
	},
	setup() {
		const getNotifications = async () => {
			var userId =  store.getters.getUserId();
            if (isLoggedin() && userId > 0) {
                try {
					loading.value = true;

					var resp = await fetchData.methods.fetchData('GET', 'GetNotifications', null, userId, currentPage.value);
					notificationMenuItems.value.length == 0 ? notificationMenuItems.value.push(resp) : notificationMenuItems.value.push(...resp);
					console.log("loading more notification....");
					loading.value = false;

                } catch (error) {
					console.log(error)
					notfound.value = true;
                }
            }
        }

		const loadMoreNotification = () => {
			getNotifications();
			currentPage.value++;
		}
		return { 
			loadMoreNotification,
			getNotifications
		}
	},
}
</script>


<style>
.scroll_panel {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 78vh;
    max-width: 32vw;
}

.onlineUsersContainer {
    scroll-snap-type: y proximity;
    overflow-y: scroll;
    flex-direction: column;
    display: flex;
    padding-inline: 4px;
}

</style>