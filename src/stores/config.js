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
      PostFriendRequest: 'api/notification/postFriendRequest/',
      GetNotifications: 'api/notification/',
      //Chat
      GetAllChatRoom: 'api/chat/chatRooms/',
      GetChatContent: 'api/chat/',
      PostChatMessage: 'api/chat/newChat/',      
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
      DeleteFriend: 'api/friend/',
      AcceptFriendRequest: 'api/friend/',
      GetMessageFriends: 'api/friend/',
      GetAllPeople: 'api/personal/getAll/',
      //User
      FirstLogin: 'api/users/',
      GetProfile: 'api/users/profilePage/',
      turnOffReminder: 'api/users/turnOffReminder/',
      ModifyPw: 'api/users/changePw',
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


//Todo refactor similiarly like: 
// import { createStore } from "vuex";

// const store = createStore({
//   state: {
//     serverRoutes: [
//       {pathName: 'uploadImage', path: "api/personal/upload/", auth: true},
//       {pathName: 'Search', path: 'api/navigation/search/', auth: false},
//       {pathName: 'register', path: 'api/users/Signup/', auth: false},
//       {pathName: 'login', path: 'api/users/Authenticate/', auth: false},
//       {pathName: 'PostFriendRequest', path: 'api/notification/postFriendRequest/', auth: false},
//       {pathName: 'GetNotifications', path: 'api/notification/', auth: false},
//       {pathName: 'GetAllChatRoom', path: 'api/chat/chatRooms/', auth: false},
//       {pathName: 'GetChatContent', path: 'api/chat/', auth: false},
//       {pathName: 'NotificationRead', path: 'api/notification/notificationRead/', auth: false},
//       {pathName: 'GetAllPeople', path: 'api/personal/getAll/', auth: false},
//       {pathName: 'GetUserById', path: 'api/users/', auth: false},
//       {pathName: 'PostChatMessage', path: 'api/chat/newChat/', auth: false},
//       //posts - comments
//       {pathName: 'CreateNewPost', path: 'api/post/createNew/', auth: false},
//       {pathName: 'GetAllPost', path: "api/post/GetAllPost/", auth: false},
//       {pathName: 'postComment', path: "api/postComment/", auth: false},
//       {pathName: 'putPost', path: "api/post/", auth: false},
//       {pathName: 'DeletePost', path: "api/post/delete/", auth: false},
//       {pathName: 'action', path: 'api/post/action/', auth: false}, //like-dislike action

//       //Friends
//       {pathName: 'GetFriends', path: 'api/friend/', auth: false},
//       {pathName: 'DeleteFriend', path: 'api/friend/', auth: false},
//       {pathName: 'AcceptFriendRequest', path: 'api/friend/', auth: false},


//       {pathName: 'GetProfile', path: 'api/users/profilePage/', auth: true}
//     ]
//   },
//   getters: {
//     getServerRoute: (state) => (routeName) => {
//       //const firstKey = Object.values(state.serverRoutes);
//       console.log(state.serverRoutes.find(path => path.pathName === routeName))
//       return state.serverRoutes.find(path => path.pathName === routeName)
  

//     },
//     requiresAuth: (state) => (routeName) => {
//       return state.serverRoutes[auth] || "";
//     }
//   }
// })

// export default store
