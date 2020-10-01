const express = require('express');
const router = express.Router();

const settings = require('../../database/settingsData');

/**
 * Route handles get requests for a given users settings information.
 */
router.get('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const data = await settings.getSettings(id);
        res.status(200).json({data});
    } catch (err) {
        return next(err);
    }
});

/**
 * Route handles requests for a change in user setting.
 */
router.patch('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    const update = req.body.value;
    const type = req.body.type;
    try {
        await settings.updatePrivacy(id, update, type);
        res.status(200).json({"message": "Success"});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;