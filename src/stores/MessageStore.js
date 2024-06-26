import { createStore } from 'vuex';
import fetchData from '@/stores/server_routes';
import UserStore from './UserStore';
import eventBus from '@/stores/eventBus.js';

export default createStore({
  state: {
    emojis: [],

    loading: false,
    userChatHeads: [],
    //The first item in the array is the active chat, 
    //every other items are chat heads next to the messaging chat.
    //Contains the user if no content for it was loaded. 
    //And also stores all the data for the chat the object hierarchy looks like follows:
    /*
    
      var chat = {
        'user': {
          id: 1511,
          firstName: 'Test'
          middleName: null,
          lastName: 'Elek',
          avatar: 'sdfcxvblécvklbncfvbjmdffdes'
        },
        'data': [{
          MessageId: 1,
          AuthorId: 1,
          chatContentId: 1,
          message: 'Test message',
          sentDate: '2023-01-01',
          Status: 1,
        },
        {
          MessageId: 2,
          AuthorId: 1,
          chatContentId: 1,
          message: 'Test message 1',
          sentDate: '2023-01-02',
          Status: 1,
        }],
        totalPages: 16,
        currentPage: 1,
        roomid: 59
      };
    */
   
  },
  mutations: {
    setFrequentlyUsedEmojis(state, emoji) {
      state.emojis = emoji;
    },
    //for overlay:
    setActiveChat(state, chatContents) {
      state.activeChat = chatContents;
    },
    addItemToChat(state, message) {
      console.log(state.userChatHeads[0].chat.data);
      
      state.userChatHeads[0].chat.data.push(message);
    },
    showLoader(state, show) {
      state.loading = show;
    },

  },
  getters: {
    getFrequentlyUsedEmojis: (state) => {
      return state.emojis;
    },
    //Overlay getters:
    getActiveChat: (state) => () => {
      if (state.userChatHeads[0] !== undefined){
        return state.userChatHeads[0]; //First item is the activeChat the other ones the chatHeads.
      }
    },
    getChatHeads: (state) => () => {
      return state.userChatHeads.slice(1); 
    },
    getLoadingState: (state) => () => {
      return state.loading; //Activates when loading the data.
    },
  },
  actions: {
    //Removes user from active chat and from userChatHeads. This way all the data for the user removed.
    removeOpenedChatRoom({commit}, payload) {
      const pid = payload;
      const index = this.state.userChatHeads.find(p => p.user.id === pid);
      if (index !== -1) {
        this.state.userChatHeads.splice(index, 1);
      }
    },

    
    switchMessageTab({commit}, user) {
      var chatRoomToSetActive = this.state.userChatHeads.find(p => p.user.id === user.id);
      var index = this.state.userChatHeads.indexOf(chatRoomToSetActive);
      //Remove chatRoom from the heads
      this.state.userChatHeads.splice(index, 1);
      //Set the first item to the selected one
      this.state.userChatHeads.unshift(chatRoomToSetActive);
    },

    insertMessage({commit}, message) { //inserts a message to the belonging chat if user writes from messageView
      if (this.state.userChatHeads.length > 0) {
        for (const item of this.state.userChatHeads) {
          //console.log(message);
          if (item.user.id == message.senderId || item.user.id == message.receiverId) {
            item.chat.data.push(message);
            console.log("data added to store: " + JSON.stringify(message));
          }
        }
      }
    },
    //adds user to userChatHeads if it doesn't contains the user
    async addUser({commit}, user) {
      this.state.loading = true;
      const MAX_CHAT_HEADS  = 7;

      var contents = await this.dispatch('fetchMessages', user);
      var chat = {
        'user': user,
        'chat': contents
      };

      //Add the user to the userChatHeads
      if (!this.state.userChatHeads.some(room => room.user == user)) {
        this.state.userChatHeads.unshift(chat);
      }

      if (this.state.userChatHeads.length > MAX_CHAT_HEADS) { //Maximum chatHeads is 5 
        this.state.userChatHeads.splice(MAX_CHAT_HEADS);
      }
      this.state.loading = false;
    },

    fetchMessages({commit}, user) {
      if (user !== null) {
        var response = new Promise( (resolve, reject) => {
          var data = fetchData.methods.fetchData('GET', 'GetChatContentByUserId', null, UserStore.getters.getUserId(), user.id);
          resolve(data);
        });
        return response;
      }
    },

    async loadMoreMessage({commit}) {
      this.commit('showLoader', true);
      console.log("load more msg......");
      if (this.state.userChatHeads[0]) {
        var chat = this.state.userChatHeads[0].chat;
        var roomId = chat.roomId;
        var cp = chat.currentPage;
        var totalPage = chat.totalPages;
        if (totalPage >= cp) {
          chat.currentPage++;
          //console.log("totalPage: " + totalPage + "cp: " + cp + " | roomid:" + chat.roomId);
          
          var response = await fetchData.methods
          .fetchData('GET', 'GetChatContent', null, roomId, cp);
          
          this.state.userChatHeads.find(p => p.chat?.roomId === roomId).chat?.data.unshift(...response.data);
          this.commit('showLoader', false);
          this.state.loading = false;
          return response;
        }
      }
    },
  }
})