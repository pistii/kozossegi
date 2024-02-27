import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";

//https://www.npmjs.com/package/secure-ls
var ls = new SecureLS({ isCompression: false });


export default createStore({
  state: {
    user: null,
    userId: 0,
    userIsOnline: null,
    auth_token: null,
    messageHub: [],
    userFriends: [],
    onlineFriends: [],
    shouldshowNewPasswordRestoreDialog: true,
    overlayLoading: false,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setAuthToken(state, token) {
      state.auth_token = token;
    },
    setUserId(state, id) {
      state.userId = id;
    },
    setOnlineState(state, online) {
      console.log("user is now: " + online);
      state.userIsOnline = online;
    },
    addSenderId(state, senderId) {
      state.messageHub.push(senderId)
    },
    removeElementFromArray(state, v) {
      //state.messageHub = [] //Ha üzenetet kap tesztelni
      var index = state.messageHub.indexOf(v);
      if (index !== -1) {
        state.messageHub.splice(index, 1);
      }
    },
    setUserFriends(state, friends) {
      state.userFriends = friends
    },
    setOnlineFriends(state, friends) {
      state.onlineFriends = friends
    },
    setPasswordModifyDialog(state, param) {
      state.shouldshowNewPasswordRestoreDialog = param;
    },
    setOverlayLoading(state, param) {
      state.overlayLoading = param;
    },
    clearStore() {
      ls.clear();
    },
  },
  getters: {
    hubContainsId: (state) => (id) => {
      return state.messageHub.includes(id);
    },
    messageHubLen: (state) => () => {
      return state.messageHub.length;
    },
    getUserId: (state) => () => {
      return state.userId;
    },
    getUser: (state) => () => {
      return state.user;
    },
    getUserIsOnline: (state) => () => {
      console.log("get user is now: " + state.userIsOnline);
      return state.userIsOnline;
    },
    getUserFriends: (state) => () => {
      return state.userFriends;
    },
    getOnlineUsers: (state) => () => {
      return state.onlineFriends;
    },
    getoverlayLoading: (state) => () => {
      return state.overlayLoading;
    },
    shouldshowNewPasswordRestoreDialog(state) {
      return state.shouldshowNewPasswordRestoreDialog;
    },
  },
  plugins: [createPersistedState({
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key),
    }
  })
  ],
  actions: {
    login({ commit }, { user, userId, token }) {
      return new Promise((resolve) => {
        commit('setUser', user);
        commit('setAuthToken', token);
        commit('setUserId', userId)
        resolve()
      })
    },
    clearUserData() {
      this.state.user = null;
      this.state.auth_token = null;
      this.state.userId = 0;
      this.state.messageHub = [];
      this.state.userFriends = [];
    },
    clearStore({ commit }) {
      commit('clearStore');
    },
  },
}
)