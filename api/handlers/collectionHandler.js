const { CollectionModel } = require('../../models/collectionModel');
const { ItemModel } = require('../../models/itemModel');
const { UserModel } = require('../../models/userModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');

const createCollection = handleRequest(async (req) => {
  const { userId } = req.params;
  if (!userId) throw new ExpressError('User ID not provided', 400);
  const collection = new CollectionModel(req.body);
  collection.createdBy = userId;

  // Add the first item from the items collection to the collection
  // const item = await ItemModel.findOne();
  // if (!item) throw new ExpressError('No items found', 404);
  // collection.items.push({ idx: collection.items.length, itemId: item._id });

  await collection.save();

  // Add the created collection to the user's collections array
  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);
  if (!user.collections) user.collections = [];

  user.collections.push(collection._id);

  await user.save();

  return collection;
});

const getCollections = handleRequest(async (req) => {
  let query = CollectionModel.find();
  if (req.query.name) {
    query = query.where('name', new RegExp(req.query.name, 'i'));
  }
  if (req.query.someOtherField) {
    query = query.where('someOtherField', req.query.someOtherField);
  }
  if (req.query.sortBy) {
    const order = req.query.order || 'asc';
    query = query.sort({ [req.query.sortBy]: order === 'asc' ? 1 : -1 });
  }
  query.collation({ locale: 'en', strength: 2 });
  const collections = await query.exec();

  return collections;
});

const getCollectionById = handleRequest(async (req) => {
  const { collectionId } = req.params;

  const currCollection = await CollectionModel.findById(collectionId);
  if (!currCollection) throw new ExpressError('Collection not found', 404);

  const prevCollection = await CollectionModel.findOne({ _id: { $lt: collectionId } })
    .sort({ _id: -1 })
    .limit(1);

  const nextCollection = await CollectionModel.findOne({ _id: { $gt: collectionId } })
    .sort({ _id: 1 })
    .limit(1);

  return { currCollection, prevCollection, nextCollection };
});

const getCollectionItems = handleRequest(async (req) => {
  const { collectionId } = req.params;

  const collection = await CollectionModel.findById(collectionId);
  if (!collection) throw new ExpressError('Collection not found', 404);

  // Sorting the items in the collection based on the idx field then extracting itemIds from the sorted collection.items
  const itemIds = collection.items.sort((a, b) => a.idx - b.idx).map((item) => item.itemId);

  // Retrieving items from the ItemModel based on the sorted itemIds's order
  const items = await ItemModel.aggregate([
    { $match: { _id: { $in: itemIds } } },
    { $addFields: { __order: { $indexOfArray: [itemIds, '$_id'] } } },
    { $sort: { __order: 1 } },
    { $project: { __order: 0 } }, // used to exclude the __order field from the final output.
  ]);
  if (!items) throw new ExpressError('No items found for this collection', 404);

  return items;
});

const updateCollectionItem = handleRequest(async (req) => {
  const { collectionId } = req.params;
  if (!collectionId) throw new ExpressError('Collection ID not found', 404);

  const collection = await CollectionModel.findById(collectionId);
  if (!collection) throw new ExpressError('Collection not found', 404);

  const { items } = req.body;
  if (!items || !Array.isArray(items)) throw new ExpressError('Invalid request body', 400);

  if (collection.items) collection.items = [];

  const updatedItems = await ItemModel.find({ _id: { $in: items } }).select('_id');
  const updatedItemIds = updatedItems.map((item) => item._id);

  // Update the items for the collection
  collection.items = updatedItemIds;

  await collection.save();

  return collection.items;
});

const updateCollectionById = handleRequest(async (req) => {
  const { collectionId } = req.params;

  const existingCollection = await CollectionModel.findById(collectionId);
  if (!existingCollection) throw new ExpressError('Collection not found', 404);

  const updatedCollection = await CollectionModel.findByIdAndUpdate(collectionId, req.body, {
    new: true,
  });
  return updatedCollection;
});

const deleteCollectionById = handleRequest(async (req) => {
  const { collectionId } = req.params;

  const existingCollection = await CollectionModel.findById(collectionId);
  if (!existingCollection) throw new ExpressError('Collection not found', 404);

  await CollectionModel.findByIdAndDelete(collectionId);
  return null;
});

module.exports = {
  createCollection,
  getCollections,
  getCollectionById,
  getCollectionItems,
  updateCollectionItem,
  updateCollectionById,
  deleteCollectionById,
};
