const FCM = require('fcm-node');
const config = require('../../config');
const key = config.cloudMessagingKey; // Key used to validate connection with Firebase
const fcm = new FCM(key);

/**
 * Creates a push notification message. Requires users firebase token, a type and a user ID.
 * @param {*} token 
 * @param {*} type 
 * @param {*} id 
 */
function createNotification(token, type, id) {
    let body = '';
    let title = '';
    // Determine notification type
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
        to: token, // contains the token to direct firebase to a users device
        
        // Contains notification details
        data: {
            title: title, 
            body: body,
            type: type,
            id: id
        }
    
    };
    return message;
}

/**
 * Sends a notification for direction through firebase
 * @param {*} type 
 * @param {*} token 
 */
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