const express = require('express');
const router = express.Router();

const user = require('../../database/usersData');
const notification = require('../../database/notificationData');
const fcm = require('../middleware/pushNotification');

/**
 * Route gets the user account information for the given id. 
 */
router.get('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const data = await user.getUserFriends(id);
        res.status(200).json({data});
    } catch (err) {
        return next(err);
    }
});

/**
 * Route returns a list of users matching or closely matching a search query string
 */
router.get('/search/:query', async(req, res, next) => {
    const query = req.params.query;
    try {
        const data = await user.getUserSearch(query);
        res.status(200).json({data});
    } catch (err) {
        return next(err);
    }
});

/**
 * Route adds a new relationship between two users into the database. Also sends push notification
 */
router.post('/:id', async(req, res, next) => {
    const requestorId = parseInt(req.params.id);
    const body = req.body;
    const requestee = body.requestee;
    try {
        // send notification if existing notification key
        const keys = await notification.getKeys([requestee]);
        const key = keys[0].NotificationKey;
        notification.postNotification(requestee, "friend_request", requestorId, null, req.body.time);
        fcm.sendNotification(key, "friend_request");
        await user.newFriendRequest(requestorId, requestee);
        res.status(200).json({"message": "Success"});
    } catch (err) {
        return next(err);
    }
});

/**
 * Route updates a relationship to friend in the database. Also sends a push notification.
 */
router.patch('/:id', async(req, res, next) => {
    const requesteeID = parseInt(req.params.id);
    const body = req.body;
    const requestorID = parseInt(body.requestor);
    try {
        // send notification if existing notification key
        const keys = await notification.getKeys([requestorID]);
        const key = keys[0].NotificationKey;
        notification.postNotification(requestorID, "friend_accept", requesteeID, null, req.body.time);
        fcm.sendNotification(key, "friend_accept");
        await user.acceptFriendRequest(requestorID, requesteeID);
        res.status(200).json({"message": "Success"});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
