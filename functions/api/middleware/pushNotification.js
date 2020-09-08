const FCM = require('fcm-node');
const config = require('../../config');
const key = config.cloudMessagingKey;
const fcm = new FCM(key);

function createNotification(token, type, id) {
    let body = '';
    let title = '';
    switch (type) {
        case "friend_request":
            body = "You have a new friend request!!";
            title = "New Friend Request";
            break;
        case "friend_accept":
            body = "Your friend request has been accepted!";
            title = "New friend";
            break;
        case "trip_added":
            body = "You have been added to a trip!";
            title = "Trip Update";
            break;
        default: 
            body = "You have a new notification!";
            title = "New Notification";
    }
    const message = { 
        to: token, 
        //collapse_key: 'your_collapse_key',
        
        data: {
            title: title, 
            body: body,
            type: type,
            id: id
        }
    
    };
    return message;
}

function sendNotification(type, token) {
    fcm.send(createNotification(type, token), function(err, response){
        if (err) {
            console.log("Issue sending notification");
        } else {
            console.log("Notification sent");
        }
    });
}
 
module.exports = {
    fcm,
    createNotification, 
    sendNotification
};