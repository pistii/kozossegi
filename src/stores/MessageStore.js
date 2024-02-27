import { createStore } from 'vuex';

export default createStore({
  state: {
    partnerId: 0,
    partner: [],
    chatRooms: [],
    chatContent: [],
    openedOverlayChats: [],
    currentRoomId: 0,
    currentPage: 1,
    totalPage: 1,
    emojis: [],
  },
  mutations: {
    setPartnerId(state, partnerId) {
      state.partnerId = partnerId;
    },
    setPartner(state, partner) { //Set the user to active when picked from the message partners
        state.partner = partner;
    },
    setChatRooms(state, room) { 
      state.chatRooms.unshift(room);
    },
    setChatContent(state, content) { //Az egész chatet állítja be
        state.chatContent = content;
    },
    addChatRooms(state, chat) { 
        state.openedOverlayChats.push(chat);
    },
    sendNewMessage(state, content) { //Egy darabot üzenetet tesz a contents-be, ha a felhasználó üzenetet küld valakinek
      state.chatContent.push(content);
    },
    setCurrentRoomId(state, currentRoomId) {
      state.currentRoomId = currentRoomId;
    },
    setCurrentPage(state, currentPage) {
      state.currentPage = currentPage;
    },
    setTotalPage(state, totalPage) {
      state.totalPage = totalPage;
    },
    setFrequentlyUsedEmojis(state, emoji) {
      state.emojis = emoji;
    },
  },
  getters: {
    getPartnerId: (state) => () => {
      return state.partnerId;
    },
    getPartner: (state) => () => {
        return state.partner;
    },
    getChatRooms: (state) => () => {
      return state.chatRooms;
    },
    getChatContent: (state) => () => {
        return state.chatContent;
    },
    getOpenedChatRooms: (state) => () => {
      return state.openedOverlayChats;
  },
    getCurrentRoomId: (state) => () => {
      return state.currentRoomId;
    },
    getCurrentPage: (state) => () => {
      return state.currentPage;
    },
    getTotalPage: (state) => () => {
      return state.totalPage;
    },
    getFrequentlyUsedEmojis: (state) => () => {
      return state.emojis;
    },
  },
  actions: {
    //Removes the chatroom from the overlay which has been clicked in order to close
    removeOpenedChatRoom({commit}, payload) {
      const pid = payload.personId;
      const index = this.state.openedOverlayChats.findIndex(p => p.id === pid);
      if (index !== -1) {
        this.state.openedOverlayChats.splice(index, 1);
      }
    },
  }
})