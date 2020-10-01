const db = require('./database');

/**
 * Gets a wishlist for a given user
 * @param {*} userId 
 */
function getWishlist(userId) {
    var sql = "SELECT LocationID FROM WT_Wishlist WHERE UserID = ?;"
    const parameter = [userId];
    const errorMessage = "Error getting wishlist from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Gets all locations visited by user. Unions together trips, legs and activities ensuring no duplicates.
 * @param {*} userId 
 */
function getLocations(userId) {
    sql = "SELECT LocationID FROM WT_TripPost WHERE UserID = ?\
    UNION\
    SELECT LocationID FROM WT_LegPost WHERE UserID = ?\
    UNION\
    SELECT LocationID FROM WT_ActivityPost WHERE UserID = ?";
    const parameter = [userId, userId, userId];
    const errorMessage = "Error getting locations from database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Creates a new wishlist item
 * @param {*} userId 
 * @param {*} locationId 
 */
function postWishlistItem(userId, locationId) {
    var sql = "INSERT INTO WT_Wishlist VALUES (?, ?);"
    const parameter = [userId, locationId];
    const errorMessage = "Error adding location to wishlist in database."
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Removes an item from a wishlist
 * @param {*} userId 
 * @param {*} locationId 
 */
function deleteWishlistItem(userId, locationId) {
    var sql = "DELETE FROM WT_Wishlist WHERE UserID = ? AND LocationID = ?;"
    const parameter = [userId, locationId];
    const errorMessage = "Error deleting location from wishlist in database."
    return db.queryDb(sql, parameter, errorMessage);
}

module.exports = {
    getWishlist,
    getLocations,
    postWishlistItem,
    deleteWishlistItem
}