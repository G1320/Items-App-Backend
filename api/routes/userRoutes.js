const express = require('express');
const userHandler = require('../handlers/userHandler');
const { validateUser, verifyTokenMw } = require('../../middleware');

const router = express.Router();

router.get('/', userHandler.getAllUsers);
router.get('/:sub', userHandler.getUserBySub);
router.get('/my-collections/:id', userHandler.getUserCollections);
router.post('/', validateUser, userHandler.createUser);
router.put('/:id', validateUser, userHandler.updateUser);
router.delete('/:id', userHandler.deleteUser);

router.post('/:id/add-collection/:collectionId', userHandler.addCollectionToUser);
router.post('/:id/remove-collection/:collectionId', userHandler.removeCollectionFromUser);

module.exports = router;
