const mysql = require("mysql");

const pool = mysql.createPool({
    /*connectionLimit : 1,
    host: Config.appSettings().database.host,
    user: Config.appSettings().database.username,
    password: Config.appSettings().database.password,
    database: Config.appSettings().database.database*/
    connectionLimit: 1,
    host: '34.89.126.80',
    user: 'user_1',//process.env.SQL_USER,
    password: 'user_123',//process.env.SQL_PASSWORD,
    database: 'jmccambridge06',//process.env.SQL_NAME
    //socketPath: '/cloudsql/travel-with-4cd49:europe-west2:csc7057-instance'
});

const multipool = mysql.createPool({
    /*connectionLimit : 1,
    host: Config.appSettings().database.host,
    user: Config.appSettings().database.username,
    password: Config.appSettings().database.password,
    database: Config.appSettings().database.database*/
    connectionLimit: 1,
    host: '34.89.126.80',
    user: 'user_1',//process.env.SQL_USER,
    password: 'user_123',//process.env.SQL_PASSWORD,
    database: 'jmccambridge06',//process.env.SQL_NAME
    //socketPath: '/cloudsql/travel-with-4cd49:europe-west2:csc7057-instance',
    multipleStatements: true
});

/**
 * Takes an sql line with insert parameter and returns an error or result.
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
 * Used for multi query transactions.
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
 * Takes a string as input and checks if the string is empty or contains null. This means a null value should be entered into the database instead of the string so null will be returned. If not 
 * then the string is returned.
 * @param {*} field 
 */
function checkNull(field) {
    //console.log("fieleddd");
    //console.log(field);
    if (!field) {
        return field;
    } else {
        // check if a number (taken from db instead of from device)
        if (typeof(field) === 'string') {
            //console.log("is not a number");
            if (field.trim() === "" || field === "null") {
                return null;
            } else {
                //console.log("not a number but not field");
                return field;
            }
        }
        //console.log("is a number");
        return field;
    }

}

module.exports = {
    pool: pool,
    queryDb,
    checkNull,
    multiqueryDb
}
