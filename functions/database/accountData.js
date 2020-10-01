const db = require('./database');

/**
 * Query gets profile info, settings and username for a given user id.
 * @param {*} userId 
 */
function getAccountAdminProfile(userId) {
    const sql = 'SELECT WT_UserProfile.UserID, Name, ProfilePicture, HomeLocation, Description, Dob, DateJoined, Username, Private, Locations, Notifications FROM WT_UserProfile \
                INNER JOIN WT_Login ON  WT_UserProfile.UserID = WT_Login.UserID \
                INNER JOIN WT_Settings ON WT_UserProfile.UserID = WT_Settings.UserID \
                WHERE WT_UserProfile.UserID = ?;'
    const parameter = userId;
    const errorMessage = "Error retrieving admin user from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Query returns profile info for a given user id along with the privacy setting
 * @param {*} userId 
 */
function getAccountProfile(userId) {
    const sql = 'SELECT WT_UserProfile.UserID, Name, ProfilePicture, HomeLocation, Description, Dob, DateJoined, Username, Private FROM WT_UserProfile \
                INNER JOIN WT_Login ON  WT_UserProfile.UserID = WT_Login.UserID \
                INNER JOIN WT_Settings ON WT_UserProfile.UserID = WT_Settings.UserID \
                WHERE WT_UserProfile.UserID = ?;'
    const parameter = userId;
    const errorMessage = "Error retrieving user from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Route updates a users profile info
 * @param {*} userId 
 * @param {*} query 
 */
function patchAccountProfile(userId, query) {
    const sql = "UPDATE `WT_UserProfile` SET `Name` = ?, `HomeLocation` = ?, `ProfilePicture` = ?, `Description` = ? WHERE UserId = ?;"
    const parameter = [query.name, query.home, db.checkNull(query.image), db.checkNull(query.description), userId,];
    const errorMessage = "Error updating profile in database."
    return db.queryDb(sql, parameter, errorMessage);
}

module.exports = {
    getAccountAdminProfile,
    getAccountProfile,
    patchAccountProfile
}

