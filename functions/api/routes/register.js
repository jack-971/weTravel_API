const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const register = require('../../database/registerData');
const loginData = require('../../database/loginData');

/**
 * Route creates a new user in the database.
 */
router.post('/', async(req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const dob = req.body.dob;
    const date = req.body.date;

    try {
        // check if any existing users with this username. 
        const unique = await loginData.getPassword(username);
        if (unique.length > 0) {
            res.status(200).json({"data": "not unique"});
        } else {
            // encrypt the password then post the users details with 10 saltrounds
            const hash = await bcrypt.hash(password, 10);
            await register.registerUser(username, hash, name, dob, date);
            res.status(200).json({"data": "success"});
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router;