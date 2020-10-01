const db = require('./database');

/**
 * Updates a users notification key for firebase
 * @param {*} userId 
 * @param {*} key 
 */
function patchNewKey(userId, key) {
    const sql = "Update WT_NotificationCentre SET NotificationKey = ? WHERE UserID = ?";
    const parameter = [key, userId];
    const errorMessage = "Error updating notification key in database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Query updates a users notification key to null
 * @param {*} userId 
 */
function patchRemoveKey(userId) {
    const sql = "Update WT_NotificationCentre SET NotificationKey = NULL WHERE UserID = ?";
    const parameter = [userId];
    const errorMessage = "Error removing notification key in database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Query gets the notification keys for a group of user ids.
 * @param {*} userIds 
 */
function getKeys(userIds) {
    let sql = "SELECT NotificationKey FROM WT_NotificationCentre WHERE ";
    let parameter = [];
    for (let loop = 0; loop<userIds.length; loop++) {
        // add the user id into the parameters array and update the sql statement to include it.
        parameter.push(userIds[loop]);
        sql = sql + "UserId = ?";
        //if not last element put an AND statement in
        if (userIds.indexOf(loop) === userIds.length - 1) {
            sql = sql + "AND";
        }
    } 
    const errorMessage = "Error retrieving notification keys from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Query gets notifications for a given user starting with most recent
 * @param {*} userId 
 */
function getNotifications(userId) { 
    let sql = "SELECT * FROM WT_Notification INNER JOIN WT_NotificationCentre  \
                ON WT_Notification.NotificationCentreID = WT_NotificationCentre.NotificationCentreID \
                WHERE WT_NotificationCentre.UserID = ? ORDER BY Time Desc";
    let parameter = [userId];
    const errorMessage = "Error retrieving notifications from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Query updates a notification to read
 * @param {*} notificationId 
 */
function patchNotification(notificationId) {
    let sql = "UPDATE WT_Notification SET NotificationRead = 1 WHERE NotificationID = ?";
    let parameter = [notificationId];
    const errorMessage = "Error updating notification in database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Query posts a new notification
 * @param {*} recieverId 
 * @param {*} type 
 * @param {*} senderId 
 * @param {*} tripId 
 * @param {*} time 
 */
function postNotification(recieverId, type, senderId, tripId, time) {
    let sql = "INSERT INTO WT_Notification VALUES (NULL, (SELECT NotificationCentreID FROM WT_NotificationCentre WHERE UserID = ?), 0, ?, ?, ?, ?);";
    let parameter = [recieverId, type, time, senderId, tripId];
    const errorMessage = "Error updating notification in database."
    return db.queryDb(sql, parameter, errorMessage);
}

module.exports = {
    patchNewKey,
    patchRemoveKey,
    getKeys,
    getNotifications,
    patchNotification,
    postNotification
}
