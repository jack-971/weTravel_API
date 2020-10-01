const express = require('express');
const router = express.Router();

const notification = require('../../database/notificationData');

/**
 * Routes controls user notification key for their device. If logging in the new key is saved,
 * If logging out, the key is removed.
 */
router.patch('/:id', async(req, res, next) => {
    const id = req.params.id;
    const key = req.body.key;
    const status = req.body.status;
    try {
        if (status === "login") {
            await notification.patchNewKey(id, key);
        } else {
            await notification.patchRemoveKey(id);
        }
        res.status(200).json({"message": "success"});
    } catch (err) {
        return next(err);
    }
});

/**
 * Route updates a given notifications status to read
 */
router.patch('/read/:id', async(req, res, next) => {
    const id = req.params.id;
    try {
        await notification.patchNotification(id);
        res.status(200).json({"message": "success"});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
