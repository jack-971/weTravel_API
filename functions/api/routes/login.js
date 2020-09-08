const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const fcm = require('../middleware/pushNotification');

const login = require('../../database/loginData');

/**
 * Takes a username and password combination. Extracts password hash from db using username and compares passwords. If matched generates and sends
 * a json web token back to the user with the User ID encrypted within.
 */
router.post('/', async(req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const loginDetails = await login.getPassword(username);
        const match = await bcrypt.compare(password, loginDetails[0].password);
        const userId = loginDetails[0].UserID;
        if (match) {
            const token = jwt.sign({"userId": userId}, config.privateKey);
            console.log(token);
            res.status(200).json({"token": token});
        } else {
            res.status(500).json({"message": "not authorised"});
        }
    } catch (err) {
        return next(err);
    }
});

router.get('/', async(req, res, next) => {
    try {
            res.status(500).json({"message": "it works for once"});

    } catch (err) {
        return next(err);
    }
});

module.exports = router;