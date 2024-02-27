import MessageStore from '@/stores/MessageStore';
import fetchData from '@/stores/server_routes.js';
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