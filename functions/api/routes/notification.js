const express = require('express');
const router = express.Router();

const notification = require('../../database/notificationData');

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
