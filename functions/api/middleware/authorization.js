const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * Function extracts an authorization token from a request header. Decodes token against a private key 
 * and sends request on to next route.
 * If no token or invalid then rejects request with reason.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function authorize(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send('Access denied.');
    }  else {
        try {
            jwt.verify(token, config.privateKey);
            return next();
        }
        catch (ex) {
            console.log(ex);
            return res.status(400).send('Invalid token.');
        }
    }
}

module.exports = authorize;