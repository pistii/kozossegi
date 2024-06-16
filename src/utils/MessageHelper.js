import MessageStore from '@/stores/MessageStore';
import fetchData from '@/stores/server_routes.js';
import { PostImage } from '@/stores/server_routes.js';
import { blobToFile, blobToBase64, base64ToBlob } from '@/utils/common.js';

import UserStore from '@/stores/UserStore';

export async function createNewChatRoom(user) {
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
    
    return obj;
}


export async function onSendMessage(message, partnerId, url = null, mimeType, callback) {
    var userId = UserStore.state.userId;

    //Message sending without file    
    if (!url) { //Most times the url will be empty, so this will be sent to a different endpoint
        if (message !== null && message.length > 0) {
            console.log("üzenetküldés fájl nélkül");
            let sendValue = {
                "chatContentId": 1,
                "chatFile": null,
                "senderId": userId,
                "authorId": userId,
                "receiverId": partnerId,
                "message": message,
                "status": 1,
            }
            var resp = await fetchData.methods.fetchData('POST', "PostChatMessage", sendValue);
            callback(sendValue);
            return;
        }
    }
    
    //Send message with files
    var imageTypes = ["image/png", "image/jpeg", "image/gif", "image/bmp"];
    var audioType = "audio/wav";
    let videoTypes = ["video/mp4"];

    const file = new FormData();
    file.append("senderId", userId);
    file.append("authorId", userId);
    file.append("receiverId", partnerId);
    file.append("message", message);
    file.append("status", 1);
    
    if (url && (imageTypes.includes(mimeType) || videoTypes.includes(mimeType))) { 
        //handle images
        console.log("image sending....");
        var blobObj = await fetch(url).then(r => r.blob());
        
        const fileToSend = await blobToFile(blobObj, "testName", mimeType);
        
        file.append('chatFile.Name', "test name");
        file.append('chatFile.Type', mimeType); 
        file.append('chatFile.File', fileToSend); 
    }

    else if (mimeType == audioType){
        console.log("audio file sending....");
        let blobObj = await fetch(url).then(r => r.blob());
        const fileBlob = blobToFile(blobObj, "fileName", mimeType);
        
        file.append('chatFile.Name', fileBlob.name);
        file.append('chatFile.Type', fileBlob.type);
        file.append('chatFile.File', fileBlob); 
    }

    await PostImage('POST', 'PostFile', file).then((resp) => { 
            resp.receiverId = partnerId; 
            callback(resp);
        });
};

//Called to send a message to the selected user
export function sendMessageToUser(user) {
    if (!MessageStore.getters.getOpenedChatRoom() != null) {
        MessageStore.commit('addChatRooms', user);
    }
    MessageStore.commit('setPartner', user);
};