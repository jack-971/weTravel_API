const jwt = require('jsonwebtoken');
const config = require('../../config');

function authorize(req, res, next) {
    console.log("in authorize middleware");
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
        return res.status(401).send('Access denied.');
    }  else {
        try {
            console.log(config.privateKey);
            const decoded = jwt.verify(token, config.privateKey);
            console.log(decoded);
            return next();
        }
        catch (ex) {
            console.log(ex);
            return res.status(400).send('Invalid token.');
        }
    }
}


module.exports = authorize;