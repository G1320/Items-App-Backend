const express = require('express');
const router = express.Router();
const itemHandler = require('../handlers/itemHandler');

// item routes
router.post('/', itemHandler.createItem);
router.get('/', itemHandler.getItems);
router.get('/:itemId', itemHandler.getItemById);
router.put('/:itemId', itemHandler.updateItemById);
router.delete('/:itemId', itemHandler.deleteItemById);

router.post('/:collectionId/add-to-collection/:itemId', itemHandler.addItemToCollection);
router.delete('/:collectionId/remove-from-collection/:itemId', itemHandler.removeItemFromCollection);
router.post('/:wishlistId/add-to-wishlist/:itemId', itemHandler.addItemToWishlist);
router.delete('/:wishlistId/remove-from-wishlist/:itemId', itemHandler.removeItemFromWishlist);

module.exports = router;
