import * as signalR from '@microsoft/signalr'
import store from '../stores/UserStore';
import MessageStore from '../stores/MessageStore'
import eventBus from '../stores/eventBus';
import { isLoggedin } from './auth';
import { compareArrays } from './common';

var chatConnection;
var notificationConnection;

async function SetupConnection(callback) {
    connection = new signalR.HubConnectionBuilder()
        .withUrl('ws://localhost:5000/Chat', {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => { return store.state.auth_token }
        })
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
    .configureLogging(signalR.LogLevel.Information) //TODO
        //.withAutomaticReconnect([0, 0, 10000])
        .build();
}
export async function WatchChat(callback) {
    return new Promise(async (resolve) => {
        if (!connection) {
            SetupConnection();
        }

        connection.on("ReceiveMessage", async function (fromId, userId, message) {
            console.log("watch from message")

            // console.log("üzenet tőle: " + fromId,
            //   "üzenetet szövege: " + message +
            //   "\n userId connection: " + userId
            // );

            let data = {
                "senderId": fromId,
                "authorId": fromId,
                "receiverId": store.state.userId,
                "message": message,
                "status": 1
            };

            MessageStore.commit('sendNewMessage', data); //Storeban való tároláshoz
            eventBus.emit('new-message', data); //Értesíti a staybottom metódust hogy frissüljön a csetben


            callback(data);
            resolve(data);
        });

        try {
            console.log(isLoggedin)
            if (isLoggedin) {
                console.log("starting connection....")
                await connection.start();
                setInterval(async () => {
                    await GetOnlineUser();
                }, 15000);

                // Eseményfigyelő az online barátok listájának fogadására
                connection.on("ReceiveOnlineFriends", (onlineFriends) => {
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
    if (connection) {
        var userId = store.state.userId;
        var userFriends = store.state.userFriends;
        try {
            await connection.invoke("ReceiveOnlineFriends", userId, userFriends);

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