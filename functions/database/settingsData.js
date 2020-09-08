const db = require('./database');
const { param } = require('../api/routes/settings');

/**
 * Gets the privacy settings for a given user ID.
 * @param {*} userId 
 */
function getSettings(userId, update) {
    const sql = "SELECT Private, Notifications, Locations FROM WT_Settings WHERE UserID = ?;"
    console.log("in set");
    const parameter = userId;
    const errorMessage = "Error getting privacy settings"
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Changes the a determined setting in the database for a given userId.
 * @param {*} userId 
 */
function updatePrivacy(userId, update, type) {
    var setting = null;
    if (type === "private") {
        setting = "Private";
    } else if (type === "location") {
        setting = "Locations";
    } else if (type === "notifications") {
        setting = "Notifications";
    }
    const sql = "UPDATE WT_Settings SET " + setting + " = ? WHERE UserID = ?;"
    const parameter = [update, userId];
    const errorMessage = "Error updating privacy setting"
    return db.queryDb(sql, parameter, errorMessage);
}

module.exports = {
    updatePrivacy,
    getSettings
}