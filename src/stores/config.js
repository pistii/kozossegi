import { createStore } from "vuex";

const store = createStore({
  state: {
    serverRoutes: {
      Search: 'api/navigation/search/',
      register: 'api/users/Signup/',
      forgotPw: 'api/users/ForgotPw/',
      checkOTP: 'api/users/checkVerCode',
      //Notifications
      NotificationRead: 'api/notification/notificationRead/',
      GetNotifications: 'api/notification/',
      //Chat
      GetAllChatRoom: 'api/chat/chatRooms/',
      GetChatContent: 'api/chat/',
      PostChatMessage: 'api/chat/newChat/',
      PostFile: 'api/chat/file/',
      //Posts
      CreateNewPost: 'api/post/createNew/',
      GetAllPost: "api/post/GetAllPost/",
      postComment: "api/postComment/",
      putPost: "api/post/",
      DeletePost: "api/post/delete/",
      action: 'api/post/action/', //like-dislike action
      GetAllPostWithImage: 'api/image/getAll/',
      
      //Comment
      newComment: 'api/comment/newComment/',
      //Friends
      GetFriends: 'api/friend/', //??
      PostFriendRequest: 'api/friend/postFriendRequest/',
      DeleteFriend: 'api/friend/',
      AcceptFriendRequest: 'api/friend/add/',
      GetMessageFriends: 'api/friend/',
      GetAllPeople: 'api/personal/getAll/',
      //User
      FirstLogin: 'api/users/',
      GetProfile: 'api/users/profilePage/',
      turnOffReminder: 'api/users/turnOffReminder/',
      ModifyPw: 'api/users/password/modify/',
      avatarUpload: 'api/image/upload/avatar/',
      RegisterStep2: 'api/users/registerComplete',
      modify: 'api/users/modify'
    }
  },
  getters: {
    getServerRoute: (state) => (routeName) => {
      return state.serverRoutes[routeName] || "";
    }
  }
})

export default store