const db = require('./database');
const { param } = require('../api/routes/profile');

function getAccountAdminProfile(userId) {
    const sql = 'SELECT WT_UserProfile.UserID, Name, ProfilePicture, HomeLocation, Description, Dob, Username, Private, Locations, Notifications FROM WT_UserProfile \
                INNER JOIN WT_Login ON  WT_UserProfile.UserID = WT_Login.UserID \
                INNER JOIN WT_Settings ON WT_UserProfile.UserID = WT_Settings.UserID \
                WHERE WT_UserProfile.UserID = ?;'
    const parameter = userId;
    const errorMessage = "Error retrieving admin user from database."
    return db.queryDb(sql, parameter, errorMessage);
}

function getAccountProfile(userId) {
    const sql = 'SELECT WT_UserProfile.UserID, Name, ProfilePicture, HomeLocation, Description, Dob, Username, Private FROM WT_UserProfile \
                INNER JOIN WT_Login ON  WT_UserProfile.UserID = WT_Login.UserID \
                INNER JOIN WT_Settings ON WT_UserProfile.UserID = WT_Settings.UserID \
                WHERE WT_UserProfile.UserID = ?;'
    const parameter = userId;
    const errorMessage = "Error retrieving user from database."
    return db.queryDb(sql, parameter, errorMessage);
}

function patchAccountProfile(userId, query) {
    const sql = "UPDATE `WT_UserProfile` SET `Name` = ?, `HomeLocation` = ?, `ProfilePicture` = ?, `Description` = ? WHERE UserId = ?;"
    const parameter = [query.name, query.home, query.image, query.description, userId,];
    const errorMessage = "Error updating profile in database."
    return db.queryDb(sql, parameter, errorMessage);
}

module.exports = {
    getAccountAdminProfile,
    getAccountProfile,
    patchAccountProfile
}

