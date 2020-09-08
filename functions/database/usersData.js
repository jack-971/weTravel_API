const db = require('./database');

/**
 * Queries database to find any instances of the user id in the relationships table. Searches both the first user column and the second user column
 * then unions them together to make on table.
 * @param {*} userId 
 */
function getUserFriends(userId) {
    const select = "SELECT WT_UserProfile.UserID, Name, ProfilePicture, HomeLocation, Description, Dob, Username, FirstUserID, SecondUserID, WT_RelationshipType.RelationshipType, Private \
    FROM WT_Relationships INNER JOIN WT_RelationshipType ON WT_Relationships.RelationshipType= WT_RelationshipType.RelationshipTypeID"
    const sql = select+ " INNER JOIN WT_UserProfile ON WT_Relationships.SecondUserID = WT_UserProfile.UserID \
    INNER JOIN WT_Settings ON WT_UserProfile.UserID = WT_Settings.UserID \
    INNER JOIN WT_Login ON WT_Relationships.SecondUserID = WT_Login.UserID \
    WHERE FirstUserID = ? UNION \
    " + select + " INNER JOIN WT_UserProfile ON WT_Relationships.FirstUserID = WT_UserProfile.UserID \
    INNER JOIN WT_Settings ON WT_UserProfile.UserID = WT_Settings.UserID \
    INNER JOIN WT_Login ON WT_Relationships.FirstUserID = WT_Login.UserID \
    WHERE SecondUserID = ?;"
    const parameter = [userId, userId];
    const errorMessage = "Error retrieving user friend list from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Queries database to get a list of users matching or similar to the query. Does three searches in order to prioritise better matches.
 * First searches identical matches. Second searches matches starting with the same sequence of letters and third those containing the 
 * sequence of letters. Unions tables together.
 * @param {*} query 
 */
function getUserSearch(query) {
    const select = "SELECT WT_UserProfile.UserID, Name, Dob, HomeLocation, ProfilePicture, Description, Username, Private \
     FROM WT_UserProfile INNER JOIN WT_Login ON WT_UserProfile.UserID = WT_Login.UserID \
     INNER JOIN WT_Settings ON WT_UserProfile.UserID = WT_Settings.UserID";
    const sql = select + " WHERE Name = ? OR Username = ? UNION " + select + " WHERE Name LIKE ? OR Username LIKE ? UNION " + select + " WHERE Name LIKE ? OR Username LIKE ?";
    console.log(sql);
    const parameter = [query, query, query+"%", query+"%", "%"+query+"%", "%"+query+"%"];
    const errorMessage = "Error retrieving user search from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Adds a new relationship into the database. Takes a requestor id and the requstees ID. Always inserts the lower of the ID values into the 
 * database so calculates this and then determines if it the requestor was the first or second ID to be inserted.
 * @param {*} requestorId 
 * @param {*} request 
 */
function newFriendRequest(requestorId, requesteeId) {
    const sql = "INSERT INTO WT_Relationships (FirstUserID, SecondUserID, RelationshipType) VALUES (?, ?, ?);"
    var parameter = null;
    if (requestorId < requesteeId) {
        parameter = [requestorId, requesteeId, 1] // requestor id smaller so goes first and request of 1 = sent by first in db
    } else {
        parameter = [requesteeId, requestorId, 2] // requestor id larger so goes second and request of 2 = sent by second in db
    }
    const errorMessage = "Error inserting new relationship into database";
    console.log("about to send sql");
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Adds a new relationship into the database. Takes a requestor id and the requstees ID. Always inserts the lower of the ID values into the 
 * database so calculates this and then determines if it the requestor was the first or second ID to be inserted.
 * @param {*} requestorId 
 * @param {*} request 
 */
function acceptFriendRequest(requestorId, requesteeId) {
    const sql = "UPDATE `WT_Relationships` SET `RelationshipType` = ? WHERE `WT_Relationships`.`FirstUserID` = ? AND `WT_Relationships`.`SecondUserID` = ?;"
    var parameter = null;
    console.log(requestorId, requesteeId);
    if (requestorId < requesteeId) {
        parameter = [3, requestorId, requesteeId];
    } else {
        parameter = [3, requesteeId, requestorId];
    }
    const errorMessage = "Error accepting friend request in database";
    return db.queryDb(sql, parameter, errorMessage);
}

module.exports = {
    getUserFriends,
    getUserSearch,
    newFriendRequest,
    acceptFriendRequest
}
