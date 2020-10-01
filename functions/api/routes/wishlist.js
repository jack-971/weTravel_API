const express = require('express');
const router = express.Router();

const wishlist = require('../../database/wishlistData');

/**
 * Route gets a users wishlist. If for a profile type also returns list of all locations user has visited.
 */
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

   /**
    * Route creates a new item in a users wishlist
    */
router.post('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        await wishlist.postWishlistItem(id, req.body.location);
       res.status(200).json({"message": "success"});
       } catch (err) {
           return next(err);
       }
   });

   /**
    * Route removes an item from a users wishlist.
    */
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