const express = require('express');
const router = express.Router();

const wishlist = require('../../database/wishlistData');

router.get('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const userWishlist = await wishlist.getWishlist(id);
        if (req.query.type === 'profile') {
            const locations = await wishlist.getLocations(id);
            res.status(200).json({"wishlist": userWishlist, "locations":locations});
        } else {
            res.status(200).json({"wishlist": userWishlist});
        }
       } catch (err) {
           return next(err);
       }
   });

router.post('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        await wishlist.postWishlistItem(id, req.body.location);
       res.status(200).json({"message": "success"});
       } catch (err) {
           return next(err);
       }
   });

   router.delete('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        await wishlist.deleteWishlistItem(id, req.query.location);
       res.status(200).json({"message": "success"});
       } catch (err) {
           return next(err);
       }
   });

   module.exports = router;