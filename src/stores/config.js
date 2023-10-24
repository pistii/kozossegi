import { createStore } from "vuex";

const store = createStore({
  state: {
    serverRoutes: {
      uploadImage: "api/personal/upload/",
      Search: 'api/navigation/search/',
      register: 'api/users/Signup/',
      login: 'api/users/Authenticate/',
      PostFriendRequest: 'api/notification/postFriendRequest/',
      GetNotifications: 'api/notification/',
      GetAllChatRoom: 'api/chat/chatRooms/',
      GetChatContent: 'api/chat/',
      NotificationRead: 'api/notification/notificationRead/',
      GetAllPeople: 'api/personal/getAll/',
      GetUserById: 'api/users/',
      PostChatMessage: 'api/chat/newChat/',
      MyProfile: 'api/personal/myprofile/',
      //posts - comments
      CreateNewPost: 'api/post/createNew/',
      GetAllPost: "api/post/GetAll/",
      postComment: "api/postComment/",
    }
  },
  getters: {
    getServerRoute: (state) => (routeName) => {
      return state.serverRoutes[routeName] || "";
    }
  }
})

export default store
