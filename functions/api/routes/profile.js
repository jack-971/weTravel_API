const express = require('express');
const router = express.Router();

const user = require('../../database/accountData');
const notification = require('../../database/notificationData');
const friends = require('../../database/usersData');

/**
 * Get the user account information for the given id. 
 */
router.get('/admin/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        let [data, notifications, friendsList] = await Promise.all([user.getAccountAdminProfile(id), notification.getNotifications(id), 
            friends.getUserFriends(id)]);
        res.status(200).json({data, notifications, friendsList});
    } catch (err) {
        return next(err);
    }
});

/**
 * Get the user account information for the given id.
 */
router.get('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const data = await user.getAccountProfile(id);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({data});
    } catch (err) {
        return next(err);
    }
});

router.patch('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    console.log(updates);
    const data = await user.patchAccountProfile(id, updates);
    res.status(200).json({status: 'success'});
});

router.post('/', async(req, res, next) => {
    //const id = parseInt(req.params.id);
    //const user = await getUser(id);
    //res.json({status: 'success', data: {user}});
    const user = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(200).json({
        message: "Handling post requests",
        createdUser: user
    });
});



router.delete('/:id', async(req, res, next) => {
    //const id = parseInt(req.params.id);
    //const user = await getUser(id);
    //res.json({status: 'success', data: {user}});
    res.status(200).json({
        message: "Handling delete requests"
    });
});

module.exports = router;

