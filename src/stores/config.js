import { createStore } from "vuex";

const store = createStore({
  state: {
    serverRoutes: {
      getPosts: "api/posts",
      postComment: "api/postComment",
      uploadImage: "api/personal/upload",
      searchBox: 'api/search',
      register: 'users/Signup',
      PostFriendRequest: 'api/notification/postFriendRequest',
      GetNotifications: 'api/notification/',
      GetAllChatRoom: 'api/chat/chatRooms/',
      GetChatContent: 'api/chat/',
      NotificationRead: 'api/notification/notificationRead/',
      GetAllPeople: 'api/personal/getAll/',
      GetUserById: 'users/'
    }
  },
  getters: {
    getServerRoute: (state) => (routeName) => {
      return state.serverRoutes[routeName] || "";
    }
  }
})

export default store
