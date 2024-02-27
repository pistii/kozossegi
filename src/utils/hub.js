import * as signalR from '@microsoft/signalr'
import store from '../stores/UserStore';
import MessageStore from '../stores/MessageStore'
import eventBus from '../stores/eventBus';
import { isLoggedin } from './auth';
import { compareArrays } from './common';

var connection;

async function SetupConnection(callback) {
    connection = new signalR.HubConnectionBuilder()
        .withUrl('ws://localhost:5000/Chat', {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => { return store.state.auth_token }
        })
        //.configureLogging(signalR.LogLevel.Information) //TODO
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

export const disconnect = () => {
    if (connection) {
        connection.stop();
    }
};



/* 
TODO:
from profileView, although it was never called,
 I don't remember if it is a tested method, but should implement here for the notification
ChatHubConnection() {

            // Create a function that the hub can call to broadcast messages.
            connection.on("ReceiveNotification", async function (userId, data) {
                // Html encode display name and message.
                
                    const noti = {
                    user: data.personId,
                    fromUser: data.notificationFrom,
                    content: data.notificationContent,
                    createdAt: data.createdAt,
                    isNew: data.isNew,
                    type: data.notificationType,
                    avatar: data.notificationAvatar
                    }
                    console.log(noti)
                console.log("üzenetet kaptál tőle: " + data.notificationContent + "\n ConnectionId: " + userId)
            });

            try {
                connection.start()
                .then(async function () {
                   console.log("receive connection successful " )
            })
            .catch(error => {
                console.error(error.message);
            });
        } catch (err) {
            console.error("hiba: " + err);
        }
        },
*/
