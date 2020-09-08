const db = require('./database');
const { param } = require('../api/routes/register');

function registerUser(username, password, name, dob, date) {
    const sql = "START TRANSACTION; \
    INSERT INTO WT_User VALUES (NULL); \
    SET @last_user_id = LAST_INSERT_ID(); \
    INSERT INTO WT_UserProfile VALUES (NULL, @last_user_id, ?, ?, NULL, NULL, NULL, ?); \
    INSERT INTO WT_Settings VALUES (NULL, @last_user_id, 1,1,1); \
    INSERT INTO WT_Login VALUES (NULL, ?, ?, @last_user_id); \
    INSERT INTO WT_NotificationCentre VALUES (NULL, @last_user_id, NULL); \
    COMMIT;";
    parameter = [name, dob, date, username, password];
    const errorMessage = "Error registering user in database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}


module.exports = {
    registerUser
}