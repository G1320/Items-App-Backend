const express = require('express');
const router = express.Router();

const collectionHandler = require('../handlers/collectionHandler');
const { validateCollection, verifyTokenMw } = require('../../middleware');

router.get('/', collectionHandler.getCollections);
router.get('/:collectionId', collectionHandler.getCollectionById);
router.post(
  '/:userId/create-collection',

  validateCollection,
  collectionHandler.createCollection
);
router.put('/:collectionId', validateCollection, collectionHandler.updateCollectionById);
router.get('/:collectionId/items', collectionHandler.getCollectionItems);
router.put('/:collectionId/items', collectionHandler.updateCollectionItem);
router.delete('/:collectionId', collectionHandler.deleteCollectionById);

module.exports = router;
