import MessageStore from '@/stores/MessageStore';
import fetchData from '@/stores/server_routes.js';
import { PostImage } from '@/stores/server_routes.js';
import { blobToFile } from '@/utils/common';

import UserStore from '@/stores/UserStore';

export async function createNewChatRoom(user) {
    
    var chatRooms = await fetchData.methods
        .fetchData('GET', 'GetAllChatRoom', null, UserStore.state.userId);
    MessageStore.commit('setChatRooms', chatRooms);

    console.log(user)
    var chatRoomKey = {
        'receiverId': user.id,
        'senderId': UserStore.state.userId,
        'chatContents': []
    }
    var chatRoomValue = {
        'avatar': user.avatar,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'middleName': user.middleName,
        'userId': user.id
    }
    console.log(chatRoomValue)
    var obj = {
        'key': chatRoomKey, 
        'value': chatRoomValue
    }
    
    if (!doesRoomExist(chatRooms, chatRoomKey)) {
        // Ha a szoba még nem létezik, hozzáadjuk
        MessageStore.commit('setChatRooms', obj);
    }
    return obj;
}

//Visszaad egy indexet ha még nem létezik az adott szoba. Ellenőrzi azt is hogy a beszélgetőpartner írt korábban, ebben az esetben ő rendelkezik a senderId-val
export function doesRoomExist(chatRooms, chatRoomKey) {
    // Az elem indexének megkeresése, ha a kulcsok megegyeznek
    if (chatRooms != null) {
        const index = chatRooms.findIndex(item => 
            item.key.senderId === chatRoomKey.senderId && 
            item.key.receiverId === chatRoomKey.receiverId ||
            item.key.receiverId === chatRoomKey.senderId && //Beszélgetőpartner ellenőrzése
            item.key.senderId === chatRoomKey.receiverId
        );
    // Ha az index -1, az azt jelenti, hogy nincs találat, tehát még nincs ilyen szoba
    return index !== -1;
    }
    return -1;
}

export async function onSendMessage(message, url = null, callback) {
    var userId = UserStore.state.userId;
    var partnerId = MessageStore.getters.getPartnerId();

    if (!url) { //Most times the url will be empty
        if (message.length > 0) {
            let sendValue = {
                "senderId": userId,
                "authorId": userId,
                "receiverId": partnerId,
                "message": message,
                "status": 1
            }
            await fetchData.methods.fetchData('POST', "PostChatMessage", sendValue)
            .then(callback(sendValue));
        }
    }
    else {
        var data = blobToFile(url, "name", "audio/mp3");
        const file = new FormData();
        file.append("senderId", userId);
        file.append("authorId", userId);
        file.append("receiverId", partnerId);
        file.append("message", "sdfgdfg");
        file.append("status", 1);
        
        file.append('chatFile.Name', data.name); 
        file.append('chatFile.Type', data.type); 
        file.append('chatFile.File', data); 
        await PostImage('POST', 'PostFile', file).then(resp => callback(resp));
    }
};