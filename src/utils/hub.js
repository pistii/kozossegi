import * as signalR from '@microsoft/signalr'
import store from '../stores/UserStore';
import MessageStore from '@/stores/MessageStore.js';
import eventBus from '../stores/eventBus';
import { isLoggedin } from './auth';
import { compareArrays } from './common';
import { base64ToBlob, blobToUrl, fileToBlob } from '@/utils/common.js';
import fetchData from '@/stores/server_routes.js';

var chatConnection;
var notificationConnection;

async function SetupConnection(callback) {
    chatConnection = new signalR.HubConnectionBuilder()
        .withUrl('ws://localhost:5000/Chat', {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => { return store.state.auth_token }
        }).build();
        //.configureLogging(signalR.LogLevel.Information) //TODO
        //.withAutomaticReconnect([0, 0, 10000])
}

async function SetupNotificationConnection(callback) {
    notificationConnection = new signalR.HubConnectionBuilder()
    .withUrl('ws://localhost:5000/Notification', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => { return store.state.auth_token }
    })
    .configureLogging(signalR.LogLevel.Information) 
    //.withAutomaticReconnect([0, 0, 10000])
    .build();
}

export async function WatchChat(callback) {
    return new Promise(async (resolve) => {
        if (!chatConnection) {
            SetupConnection();
            if (isLoggedin) {
                await chatConnection.start();
            }
        }

        chatConnection.on("ReceiveMessage", async function (fromId, userId, message, file) {
            console.log("üzenet tőle: " + fromId,
              "üzenetet szövege: " + message +
              "\n userId connection: " + userId
            );
            
            let data = {
                "senderId": fromId,
                "authorId": fromId,
                "receiverId": store.state.userId,
                "message": message,
                "status": 1,
            };

            if (file) {
                let chatFile = {
                    fileToken: file.name,
                    fileType: file.type
                };

                var combinedData = Object.assign({}, data, {chatFile});
                eventBus.emit('new-message', combinedData); //notify messageView
                MessageStore.dispatch('insertMessage', combinedData);//Notify the overlays to add message
            }
            else {
                eventBus.emit('new-message', data); //notify messageView
                MessageStore.dispatch('insertMessage', data);//Notify the overlays to add message
            }
            //Adds the user id if receives a new message and doesn't contains the id. This will trigger the new message received badge on the navBar 
            if (!store.getters.hubContainsId(fromId)) {
                store.commit('addSenderIdToMessageHub', fromId);
            }

            callback(data);
            resolve(data);
        });

        try {
            //console.log(isLoggedin())
            if (isLoggedin()) {
                console.log("starting connection....")
                
                // Eseményfigyelő az online barátok listájának fogadására
                chatConnection.on("ReceiveOnlineFriends", (onlineFriends) => {
                    console.log(onlineFriends)
                    //Elég csak akkor frissíteni a tárolót ha különbözőek az értékek, így nem lesz újra renderelve az online barátok tömb
                    if (!compareArrays(onlineFriends, store.state.onlineFriends)) {
                        console.log("Online barátok érkeztek:", onlineFriends);
                        store.commit('setOnlineFriends', onlineFriends);
                    }
                });
            }
        } catch (error) {
            console.error(error.message);
        }
    });
}

async function GetOnlineUser() {
    if (chatConnection) {
        var userId = store.state.userId;
        try {
            //console.log("Querying online friends....")
            await chatConnection.invoke("ReceiveOnlineFriends", userId);

        } catch (error) {
            console.error("Hiba történt a szerveroldali metódus meghívása közben:", error);
        }
    }
}

export async function WatchNotification(callback) {
    return new Promise(async (resolve) => {
        if (!notificationConnection) {
            SetupNotificationConnection();
            console.log("starting notification connection....")
            await notificationConnection.start();
        }

        if (isLoggedin) {
            //Feliratkozás a Notification Hubra
            notificationConnection.on("ReceiveNotification", async (userId, data) => {
                /*
                createdAt: "2024-03-08T20:16:40.2895719+01:00"
                isNew : true
                notification : null
                notificationAvatar :""
                notificationContent :"seventh  test ma ünnepli a születésnapját."
                notificationId : 0
                notificationType : "Birthday"
                receiverId: 1517
                senderId : 1497
                */
                console.log("új értesítés: " + userId, data);
                if (!store.getters.getNotifications().includes(data.senderId)) 
                {//Egyelőre csak az annak az ellenőrzése, hogy az adott személy szerepel-e már az értesítésekben. 
                    //TODO: Ha a content is ugyanaz mint ami már az értesítések között szerepel, nem szükséges belehelyezni, 
                    store.commit('addNewNotification', data.senderId);
                }
            });
        }
    }
)};

export const disconnect = () => {
    if (chatConnection) {
        chatConnection.stop();
    } 
    if (notificationConnection) 
        notificationConnection.stop();
};


//Query friends if user is active and logged in
let idleTime;
let userIsActive = false;
let queryFriendsInterval = 15000; //How frequently get the friends
let resetTimeInterval = 30000; //Reset after this period of time

setInterval( async () => {
    if (userIsActive && isLoggedin()) {
        await GetOnlineUser();
    }    
}, queryFriendsInterval);

const resetTimer = () => {
    clearTimeout(idleTime);
    if (!userIsActive) {    
        userIsActive = true;
    }
    idleTime = setTimeout(timeHandler, resetTimeInterval); //Callback if the user is inactive
}

const timeHandler = () => {
    userIsActive = false;
    //console.log("user set to: " + userIsActive);
}
//On these actions reset the timer so the user is active
document.addEventListener('mousemove', resetTimer);
document.addEventListener('mousedown', resetTimer); 
document.addEventListener('keypress', resetTimer);
document.addEventListener('touchstart', resetTimer);
