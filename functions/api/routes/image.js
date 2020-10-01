const express = require('express');
const router = express.Router();

const image = require('../../database/imageData');

/**
 * Route to post a new image. Determines if post has an existing gallery. If not creates one with the image,
 * otherwise attaches the image to the existing gallery.
 */
router.post('/:id', async(req, res, next) => {
    try {
        const postId = parseInt(req.params.id);
        // Search for existing gallery
        const galleryId = await image.getGallery(postId, req.body.type, parseInt(req.body.user));
        let newGallery = true;
        // Determine if search returned a gallery
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

/**
 * Route to get images associated with a post.
 */
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
