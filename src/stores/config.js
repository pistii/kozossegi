import { createStore } from "vuex";

const store = createStore({
  state: {
    serverRoutes: {
      getPosts: "/api/posts",
      postComment: "/api/postComment",
      uploadImage: "/api/personal/upload",
      searchBox: '/api/search'
    }
  },
  getters: {
    getServerRoute: (state) => (routeName) => {
      return state.serverRoutes[routeName] || "";
    }
  }
})

export default store
