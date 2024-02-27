import store from '@/stores/UserStore';
import MessageStore from '@/stores/MessageStore';
import fetchData from '@/stores/server_routes.js';

async function showMessage(chatRoomId, p) {
    ifContainsUserIdRemoveFromMessageHub(p.userId);
    if (MessageStore.getters.getPartner() !== p && 
        MessageStore.getters.getPartnerId() !== p.userId) {
        MessageStore.commit('setPartnerId', p.userId);
        MessageStore.commit('setPartner', p)
    }
    if (chatRoomId > 0 && chatRoomId !== MessageStore.getters.getCurrentRoomId()) {
        MessageStore.commit('setCurrentRoomId', chatRoomId);
        MessageStore.commit('setCurrentPage', 1); //set back to default
        await fetchData.methods.fetchData('GET', 'GetChatContent', null, chatRoomId, MessageStore.getters.getCurrentPage())
        .then(resp => reverseChat(resp));
    }    
}

function setStartingChatRoom(chatRoom) {
    return showMessage(chatRoom.key.chatRoomId, chatRoom.value)
}

function ifContainsUserIdRemoveFromMessageHub(userId) {
    var isNewMessage = store.getters.hubContainsId(userId);            
    if (isNewMessage) {
        //remove from the messageHub
        store.commit('removeElementFromArray', userId)
    }
}

function reverseChat(resp) {
    MessageStore.commit('setTotalPage', resp.totalPages);
    var reversed = resp.data.reverse();
    MessageStore.commit('setChatContent', reversed)
}

export {showMessage, setStartingChatRoom}