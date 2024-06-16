import { WatchChat, WatchNotification } from "./hub";
import store from '@/stores/UserStore';


//The method when triggers on page load or login
//Called from signin
export async function loginSetup() {
  WatchChat((data) => {
    if (!store.getters.hubContainsId(data.senderId))
    {
        store.commit('addSenderIdTomessageHub', data.senderId);
    }
  });

  WatchNotification((data) => {
      console.log("WatchNoti " + data)
  });
}
  
  //This method set back the values to its default state. Useful to clear data before data load
export async function SetToDefault() {
  store.state.notificationHub = [];
  store.state.messageHub = [];
}
