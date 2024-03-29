const db = require('./database');

/**
 * Query gets password from database for a given username
 * @param {*} username 
 */
function getPassword(username) {
    const sql = "Select password, UserID FROM WT_Login WHERE username = ?";
    parameter = [username];
    const errorMessage = "Error logging user into database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

module.exports = {
    getPassword
}