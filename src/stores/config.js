import { createStore } from "vuex";

const store = createStore({
  state: {
    serverRoutes: {
      getPosts: "/api/posts",
      postComment: "/api/postComment",
      uploadImage: "/api/personal/upload",
      searchBox: '/api/search',
      register: '/users',
      PostFriendRequest: '/api/notification/postFriendRequest',
      GetNotifications: '/api/notification',
      NotificationRead: '/api/notification/notificationRead/',
      GetAllPeople: '/api/personal/getAll/'
    }
  },
  getters: {
    getServerRoute: (state) => (routeName) => {
      return state.serverRoutes[routeName] || "";
    }
  }
})

export default store
