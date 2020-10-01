const express = require('express');
const router = express.Router();

const user = require('../../database/accountData');
const notification = require('../../database/notificationData');
const friends = require('../../database/usersData');
const trips = require('../../database/tripsData');

/**
 * Route gets account information for a logged in user. Returns profile, notifications, friends and newsfeed.
 */
router.get('/admin/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        let [data, notifications, friendsList, posts] = await Promise.all([user.getAccountAdminProfile(id), notification.getNotifications(id), 
            friends.getUserFriends(id), trips.getFriendsPosts(id)]);
        res.status(200).json({data, notifications, friendsList, posts});
    } catch (err) {
        return next(err);
    }
});

/**
 * Route returns the profile information for a user.
 */
router.get('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const data = await user.getAccountProfile(id);
        res.status(200).json({data});
    } catch (err) {
        return next(err);
    }
});

/**
 * Route updates a users profile information
 */
router.patch('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    await user.patchAccountProfile(id, updates);
    res.status(200).json({status: 'success'});
});

module.exports = router;

