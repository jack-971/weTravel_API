const db = require('./database');
const { param } = require('../api/routes/trips');

/**
 * Queries database for a set of user trips for a given user id and a given trip status.
 * @param {*} userId 
 */
function getUsersTrips(userId, status) {
    var sql = "SELECT * FROM WT_Trip INNER JOIN WT_TripUsers ON WT_Trip.ID = WT_TripUsers.TripID \
    INNER JOIN WT_TripStatus ON WT_TripUsers.TripStatusID = WT_TripStatus.TripStatusID\
    WHERE userID = ? AND TripStatus = ? ORDER BY DateStart IS NULL, DateStart"
    if (status === 'complete') {
        console.log("complete");
        sql = sql + " DESC;";
    } else {
        sql = sql + ";"
    }
    const parameter = [userId, status];
    const errorMessage = "Error retrieving user trip list from database."
    return db.queryDb(sql, parameter, errorMessage);
}

function getActiveTrip(userId) {
    var sql = "SELECT TripID FROM WT_TripUsers WHERE UserID = ? AND TripStatusID = 2;"
    const parameter = [userId];
    const errorMessage = "Error retrieving users active trip from database."
    return db.queryDb(sql, parameter, errorMessage);
}

function getTrip(tripId, userId) {
    var sql = "SELECT * FROM WT_Trip INNER JOIN WT_TripUsers ON WT_Trip.ID = WT_TripUsers.TripID WHERE ID = ? AND UserID = ?;"
    const parameter = [tripId, userId];
    const errorMessage = "Error retrieving trip from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Queries database for a set of user trips for a given user id and a given trip status.
 * @param {*} userId 
 */
function getTripUsers(tripId) {
    var sql = "SELECT * FROM `WT_TripUsers` INNER JOIN WT_UserProfile ON WT_TripUsers.UserID = WT_UserProfile.UserID \
    WHERE TripID = ?;";
    const parameter = [tripId];
    const errorMessage = "Error retrieving trips users from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Queries database for a list of legs associated with a trip Id.
 * @param {*} tripId 
 */
function getTripLegs(tripId, userId) {
    var sql = "SELECT * FROM WT_TripLeg INNER JOIN WT_Leg ON WT_TripLeg.LegID = WT_Leg.ID WHERE TripID = ? \
    AND WT_TripLeg.LegID IN \
    (Select WT_TripLeg.LegID FROM WT_TripLeg INNER JOIN WT_Leg ON WT_TripLeg.LegID = WT_Leg.ID WHERE WT_TripLeg.TripID = ? \
    AND WT_TripLeg.UserID = ?) \
    ORDER BY DateStart IS NULL, DateStart;";
    const parameter = [tripId, tripId, userId];
    const errorMessage = "Error retrieving trip legs from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Queries database for a list of activities associated with a trip id and user id.
 * @param {*} tripId 
 */
function getLegActivities(tripId, userId) {
    var sql = "SELECT * FROM WT_Activity \
            INNER JOIN WT_LegActivity ON WT_LegActivity.ActivityID = WT_Activity.ID  \
            WHERE WT_LegActivity.LegID IN  \
            (Select WT_TripLeg.LegID FROM WT_TripLeg INNER JOIN WT_Leg ON WT_TripLeg.LegID = WT_Leg.ID WHERE WT_TripLeg.TripID = ? \
                AND WT_LegActivity.ActivityUserID = ?) ORDER BY DateStart IS NULL, DateStart;";
    const parameter = [tripId, userId];
    const errorMessage = "Error retrieving leg activites from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Queries database to add a new trips details. 
 * @param {*} tripId 
 * @param {*} updates 
 */
function postLeg(userId, updates) {
    const sql = "START TRANSACTION; \
    INSERT INTO WT_Leg VALUES (NULL, ?, ?, ?, ?, ?, ?, ?); \
    SET @last_leg_id = LAST_INSERT_ID(); \
    INSERT INTO WT_TripLeg VALUES (?, @last_leg_id, ?); \
    COMMIT; \
    SELECT * FROM WT_Leg INNER JOIN WT_TripLeg ON WT_Leg.ID = WT_TripLeg.LegID WHERE ID = @last_leg_id;";
    parameter = [updates.Name, db.checkNull(updates.DateStart), db.checkNull(updates.DateFinish), db.checkNull(updates.Description), 
        db.checkNull(updates.LocationID), db.checkNull(updates.LocationDetail), db.checkNull(updates.Review), userId, updates.trip];
    const errorMessage = "Error adding leg to database";
    console.log("going into db");
    return db.multiqueryDb(sql, parameter, errorMessage);
}

/**
 * 
 * @param {*} userId 
 * @param {*} updates 
 */
function postActivity(userId, updates) {
    const sql = "START TRANSACTION; \
    INSERT INTO WT_Activity VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, NULL, ?); \
    SET @last_activity_id = LAST_INSERT_ID(); \
    INSERT INTO WT_LegActivity VALUES (?, @last_activity_id, ?); \
    COMMIT; \
    SELECT * FROM WT_Activity INNER JOIN WT_LegActivity ON WT_Activity.ID = WT_LegActivity.ActivityID WHERE ID = @last_activity_id;";
    parameter = [updates.Name, db.checkNull(updates.DateStart), db.checkNull(updates.DateFinish), db.checkNull(updates.Description), 
        db.checkNull(updates.LocationID), db.checkNull(updates.LocationDetail), db.checkNull(updates.Notes), db.checkNull(updates.Review), userId, updates.leg];
    const errorMessage = "Error adding activity to database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

/**
 * 
 * @param {*} legId 
 * @param {*} updates 
 */
function patchLeg(updates) {
    const sql = "UPDATE WT_Leg SET Name = ?, DateStart=?, DateFinish=?, Description=?, LocationID=?, LocationDetail=?, Review=? \
     WHERE ID = ?;"
    parameter = [updates.Name, db.checkNull(updates.DateStart), db.checkNull(updates.DateFinish), db.checkNull(updates.Description), 
        db.checkNull(updates.LocationID), db.checkNull(updates.LocationDetail), db.checkNull(updates.Review), updates.legId];
    const errorMessage = "Error updating leg in database";
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Queries database to update a trips details. 
 * @param {*} tripId 
 * @param {*} updates 
 */
function patchTrip(updates) {
    const sql = "UPDATE WT_Trip SET Name = ?, DateStart=?, DateFinish=?, Description=?, LocationID=?, LocationDetail=?, Picture = ?, Review=? \
     WHERE ID = ?;"
    parameter = [updates.Name, db.checkNull(updates.DateStart), db.checkNull(updates.DateFinish), db.checkNull(updates.Description), 
        db.checkNull(updates.LocationID), db.checkNull(updates.LocationDetail), db.checkNull(updates.Picture), db.checkNull(updates.Review), updates.tripId];
    const errorMessage = "Error updating trip in database";
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Queries database to add a new trips details. 
 * @param {*} tripId 
 * @param {*} updates 
 */
function postTrip(userId, updates) {
    const sql = "START TRANSACTION; \
    INSERT INTO WT_Trip VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?); \
    SET @last_trip_id = LAST_INSERT_ID(); \
    INSERT INTO WT_TripUsers VALUES (?, @last_trip_id, 1); \
    COMMIT; \
    SELECT * FROM WT_Trip WHERE ID = @last_trip_id;";
    parameter = [updates.Name, db.checkNull(updates.Picture), db.checkNull(updates.DateStart), db.checkNull(updates.DateFinish), db.checkNull(updates.Description), 
        db.checkNull(updates.LocationID), db.checkNull(updates.LocationDetail), db.checkNull(updates.Review), userId];
    const errorMessage = "Error updating trip in database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

// post trip post, leg post, activity post
// patch trip post, leg post, activity post

/**
 * 
 * @param {*} activityId 
 * @param {*} updates 
 */
function patchActivity(updates) {
    const sql = "UPDATE WT_Activity SET Name = ?, DateStart=?, DateFinish=?, Description=?, LocationID=?, LocationDetail=?,  \
                 Notes = ?, Review=? WHERE ID = ?;"
    parameter = [updates.name, db.checkNull(updates.startDate), db.checkNull(updates.finishDate), db.checkNull(updates.description), 
        db.checkNull(updates.locationID), db.checkNull(updates.locationDetail), db.checkNull(updates.notes), db.checkNull(updates.review), 
        updates.activityId];
    const errorMessage = "Error updating activity in database";
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Query to add a user to a trip in the database. Automatically inserts trip status in planned phase.
 * @param {*} userId 
 * @param {*} tripId 
 */
function addTripUser(userId, tripId) {
    const sql = "INSERT INTO WT_TripUsers VALUES (?, ?, ?);";
    parameter = [userId, tripId, 1];
    const errorMessage = "Error adding user to trip";
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * 
 * @param {*} userId 
 * @param {*} legId 
 * @param {*} tripId 
 */
function addLegUser(userId, legId, tripId) {
    const sql = "INSERT INTO WT_TripLeg VALUES (?, ?, ?);";
    parameter = [userId, legId, tripId];
    const errorMessage = "Error adding user to trip";
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * 
 * @param {*} userId 
 * @param {*} activityId 
 * @param {*} legIdd 
 */
function addActivityUser(userId, activityId, legId) {
    const sql = "INSERT INTO WT_LegActivity VALUES (?, ?, ?);";
    parameter = [userId, activityId, legId];
    const errorMessage = "Error adding user to activity";
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Query deletes a user from the trip user table and associated legs and activities so they are no longer linked to that trip.
 * @param {*} userId 
 * @param {*} tripId 
 */
function removeTripUser(userId, tripId) {
    const sql = "START TRANSACTION; \
                DELETE FROM WT_LegActivity WHERE ActivityUserID = ? AND LegID IN(Select LegID FROM WT_TripLeg WHERE TripID = ?); \
                DELETE FROM WT_TripLeg WHERE UserID = ? AND TripID = ?; \
                DELETE FROM WT_TripUsers WHERE UserID = ? AND TripID = ?; \
                COMMIT;";
    parameter = [userId, tripId, userId, tripId, userId, tripId];
    const errorMessage = "Error removing user from trip";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

/**
 * Removes user from a leg and any associated activities.
 * @param {*} userId 
 * @param {*} tripId 
 */
function removeLegUser(userId, legId) {
    const sql = "START TRANSACTION; \
                DELETE FROM WT_TripLeg WHERE UserID = ? AND LegID = ?; \
                DELETE FROM WT_LegActivity WHERE ActivityUserID = ? AND LegID = ?; \
                COMMIT;";
    parameter = [userId, legId, userId, legId]; // remove individual leg and all activities.
    const errorMessage = "Error removing user from trip";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

/**
 * Removes a user from an activity.
 * @param {*} userId 
 * @param {*} tripId 
 */
function removeActivityUser(userId, activityId) { 
    const sql = "DELETE FROM WT_LegActivity WHERE ActivityUserID = ? AND ActivityID = ?;";
    parameter = [userId, activityId];
    const errorMessage = "Error removing user from activity";
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Updates a trips status for a given user.
 * @param {*} userId 
 * @param {*} tripId 
 * @param {*} statusId 
 */
function patchTripActive(userId, tripId) {
    const sql = "UPDATE WT_TripUsers SET TripStatusID = 2 WHERE UserID = ? AND TripID = ?;"
    parameter = [userId, tripId];
    const errorMessage = "Error activating trip in database";
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Updates an active trip for a given user if there is one by checking for the userId and if there is a status id equal to active.
 * @param {*} userId 
 * @param {*} tripId 
 * @param {*} statusId 
 */
function patchTripComplete(userId) {
    console.log("patching trip to completeeee");
    const sql = "UPDATE WT_TripUsers SET TripStatusID = 3 WHERE UserID = ? AND TripStatusID = 2;"
    parameter = [userId];
    const errorMessage = "Error completing trip in database";
    return db.queryDb(sql, parameter, errorMessage);
    
}

/**
 * Posts a trip post in the database.
 * @param {*} userId 
 * @param {*} tripId 
 * @param {*} tripDetails 
 */
function postTripPost(userId, tripId, details) {
    const sql = "INSERT INTO WT_TripPost VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    parameter = [tripId, userId, details.Name, db.checkNull(details.Picture), db.checkNull(details.DateStart), 
        db.checkNull(details.DateFinish), db.checkNull(details.Description), db.checkNull(details.LocationID), 
        db.checkNull(details.LocationDetail), db.checkNull(details.Review)];
    const errorMessage = "Error posting trip post in database";
    console.log("about to req db");
    return db.multiqueryDb(sql, parameter, errorMessage);
}

function postLegPost(userId, legId, details) {
    const sql = "INSERT INTO WT_LegPost VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
    parameter = [legId, userId, details.Name, db.checkNull(details.DateStart), 
        db.checkNull(details.DateFinish), db.checkNull(details.Description), db.checkNull(details.LocationID), 
        db.checkNull(details.LocationDetail), db.checkNull(details.Review)];
    const errorMessage = "Error posting leg post in database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

function postActivityPost(userId, activityId, details) {
    const sql = "INSERT INTO WT_ActivityPost VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?);"; 
    parameter = [activityId, userId, details.Name, db.checkNull(details.DateStart), 
        db.checkNull(details.DateFinish), db.checkNull(details.Description), db.checkNull(details.LocationID), 
        db.checkNull(details.LocationDetail), db.checkNull(details.Notes), db.checkNull(details.Review)];
    const errorMessage = "Error posting activity post in database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

function patchTripPost(userId, updates) {
    const sql = "UPDATE WT_TripPost SET Name = ?, DateStart=?, DateFinish=?, Description=?, LocationID=?, LocationDetail=?, Picture = ?, Review=? \
     WHERE ID = ? AND UserID = ?;"
    parameter = [updates.Name, db.checkNull(updates.DateStart), db.checkNull(updates.DateFinish), db.checkNull(updates.Description), 
        db.checkNull(updates.LocationID), db.checkNull(updates.LocationDetail), db.checkNull(updates.Picture), db.checkNull(updates.Review), 
        updates.tripId, userId];
    const errorMessage = "Error updating trip post in database";
    return db.queryDb(sql, parameter, errorMessage);
}

function patchLegPost(userId, updates) {
    const sql = "UPDATE WT_LegPost SET Name = ?, DateStart=?, DateFinish=?, Description=?, LocationID=?, LocationDetail=?, Review=? \
     WHERE ID = ? AND UserID = ?;"
    parameter = [updates.Name, db.checkNull(updates.DateStart), db.checkNull(updates.DateFinish), db.checkNull(updates.Description), 
        db.checkNull(updates.LocationID), db.checkNull(updates.LocationDetail), db.checkNull(updates.Review), updates.legId, userId];
    const errorMessage = "Error updating leg post in database";
    return db.queryDb(sql, parameter, errorMessage);
}

function patchActivityPost(userId, updates) {
    const sql = "UPDATE WT_ActivityPost SET Name = ?, DateStart=?, DateFinish=?, Description=?, LocationID=?, LocationDetail=?,  \
                 Notes = ?, Review=? WHERE ID = ? AND UserID = ?;"
    parameter = [updates.Name, db.checkNull(updates.DateStart), db.checkNull(updates.DateFinish), db.checkNull(updates.Description), 
        db.checkNull(updates.LocationID), db.checkNull(updates.LocationDetail), db.checkNull(updates.Notes), db.checkNull(updates.Review), 
        updates.activityId, userId];
    const errorMessage = "Error updating activity post in database";
    return db.queryDb(sql, parameter, errorMessage);
}

module.exports = {
    getUsersTrips,
    getTripUsers,
    getTripLegs,
    getTrip,
    getLegActivities,
    patchTrip,
    patchLeg,
    patchActivity,
    addTripUser,
    addLegUser,
    addActivityUser,
    removeTripUser,
    removeLegUser,
    removeActivityUser,
    postTrip,
    postLeg,
    postActivity,
    getActiveTrip,
    patchTripActive,
    patchTripComplete,
    postTripPost,
    postLegPost,
    postActivityPost,
    patchTripPost,
    patchLegPost,
    patchActivityPost
}
