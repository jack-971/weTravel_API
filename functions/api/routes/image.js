const express = require('express');
const router = express.Router();

const image = require('../../database/imageData');

router.post('/:id', async(req, res, next) => {
    try {
        const postId = parseInt(req.params.id);
        const galleryId = await image.getGallery(postId, req.body.type, parseInt(req.body.user));
        let newGallery = true;
        if (galleryId[0].GalleryID !== null) {
            console.log("not null");
            newGallery = false;
        }
        await image.postImage(postId, req.body.url, newGallery, galleryId[0].GalleryID, req.body.type, parseInt(req.body.user));
        res.status(200).json({"message": "success"});
    } catch (err) {
        return next(err);
    }

});

router.get('/:id', async(req, res, next) => {
    try {
        const postId = parseInt(req.params.id);
        const images = await image.getImages(postId, parseInt(req.query.user), req.query.type);
        let status = 'false';
        if (images.length >0) {
            status = 'true';
        }
        res.status(200).json({"status": status, "images": images});
    } catch (err) {
        return next(err);
    }

});

module.exports = router;
