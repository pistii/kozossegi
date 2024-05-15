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

    messageHub: [], //Stored here because of the persisted state
    notificationHub: [],

    userFriends: [],
    onlineFriends: [],
    overlayLoading: false,

    overlayMessageFriends: true //True if expanded the overlay panel, false if minimized
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
    setOnlineState(state, online) { //Az online/offline mód kezeléséhez
      state.userIsOnline = online;
    },
    addSenderIdToMessageHub(state, senderId) { //Hozzáadja az új értesítések tömbjéhez az id-t, ha még nem tartalmazza
      state.messageHub.push(senderId);
    },
    addNewNotification(state, senderId) { //Hozzáadja az új értesítést, ha érkezik
      state.notificationHub.push(senderId);
    },

    removeElementFromArray(state, v) {
      state.messageHub = [] //Ha üzenetet kap tesztelni
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
    setOverlayLoading(state, param) {
      state.overlayLoading = param;
    },
    setOverlayMessageFriendsPanelTo(state, value) { //Sets the overlay message panel to visible or minimized
      state.overlayMessageFriends = value;
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
    getNotifications: (state) => () => {
      return state.notificationHub;
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

    getOverlayMessageFriendsState: (state) => () => { //Returns the state of the overlay message friends, if it is open, or minimized
      return state.overlayMessageFriends;
    } 
    
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