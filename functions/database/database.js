const mysql = require("mysql");
const config = require('../config');

/**
 * Used where only query requires execution
 */
const pool = mysql.createPool({
    connectionLimit: 1,
    host: '34.89.126.80', // used for local testing
    user: config.SQL_USER,
    password: config.SQL_PASSWORD,
    database: config.SQL_NAME,
    //socketPath:  config.SQL_PATH, // used for deployment
});

/**
 * Used for multiple queries.
 */
const multipool = mysql.createPool({
    connectionLimit: 1,
    host: '34.89.126.80', // used for local testing
    user: config.SQL_USER,
    password: config.SQL_PASSWORD,
    database: config.SQL_NAME,
    //socketPath:  config.SQL_PATH, // used for deployment
    multipleStatements: true
});

/**
 * Takes an sql query with insert parameters and returns an sql error or result. Used for single queries.
 * @param {*} sql 
 * @param {*} parameter 
 * @param {*} errorMessage 
 */
function queryDb(sql, parameter, errorMessage) {
    return new Promise(function(resolve,reject) {
            userAccountInfo = pool.query(sql, parameter, (err, result) => {
                if (err) {
                    console.log(sql);
                    console.log(parameter);
                    console.log(errorMessage);
                    reject(err);
                } else {
                    console.log(sql + parameter);
                    resolve(result);
                }
            });
    });
}

/**
 * Takes an sql query with insert parameters and returns an sql error or result. Used for multiple queries.
 * @param {*} sql 
 * @param {*} parameter 
 * @param {*} errorMessage 
 */
function multiqueryDb(sql, parameter, errorMessage) {
    return new Promise(function(resolve,reject) {
            userAccountInfo = multipool.query(sql, parameter, (err, result) => {
                if (err) {
                    console.log(sql);
                    console.log(parameter);
                    console.log(errorMessage);
                    reject(err);
                } else {
                    console.log(sql + parameter);
                    resolve(result);
                }
            });
    });
}

/**
 * Takes a string as input and checks if the string is empty or contains null. If string is empty or contains 'null' then null is returned.
 * Otherwise the field is returned.
 * @param {*} field 
 */
function checkNull(field) {
    if (!field) {
        return null; // If it itself is null
    } else {
        // check if a number (required where a value is taken from db instead of as json from device)
        if (typeof(field) === 'string') {
            // check if string contains null or is empty and return null or the field accordingly
            if (field.trim() === "" || field === "null") {
                return null;
            } else {
                return field;
            }
        }
        return field;
    }

}

module.exports = {
    pool: pool,
    queryDb,
    checkNull,
    multiqueryDb
}
