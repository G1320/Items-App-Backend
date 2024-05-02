const { ItemModel } = require('../../models/itemModel');
const { WishlistModel } = require('../../models/wishlistModel');
const { CollectionModel } = require('../../models/collectionModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');

const createItem = handleRequest(async (req) => {
  const item = new ItemModel(req.body);

  await item.save();
  return item;
});

const getItems = handleRequest(async (req) => {
  let query = ItemModel.find();
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
  const items = await query.exec();
  return items;
});

const addItemToCollection = handleRequest(async (req) => {
  const collectionId = req.params.collectionId;
  if (!collectionId) throw new ExpressError('collection ID not provided', 400);

  const itemId = req.params.itemId;
  if (!itemId) throw new ExpressError('item ID not provided', 400);

  const collection = await CollectionModel.findById(collectionId);
  if (!collection) throw new ExpressError('collection not found', 404);
  if (!collection.items) collection.items = [];

  const item = await ItemModel.findById(itemId);
  if (!item) throw new ExpressError('item not found', 404);

  item.updatedAt = new Date();

  await item.save();

  if (collection.items.length > 31) throw new ExpressError('Oops, Collection is full!', 400);
  if (collection.items.some((collectionItem) => collectionItem.itemId.equals(item._id))) {
    throw new ExpressError('Collection already includes this item!', 400);
  }

  collection.items.push({ idx: collection.items.length, itemId: item._id });
  await collection.save();

  return item;
});

const removeItemFromCollection = handleRequest(async (req) => {
  const collectionId = req.params.collectionId;
  if (!collectionId) throw new ExpressError('Collection ID not provided', 400);

  const itemIdToRemove = req.params.itemId;
  if (!itemIdToRemove) throw new ExpressError('item ID not provided', 400);

  const collection = await CollectionModel.findById(collectionId);
  if (!collection) throw new ExpressError('Collection not found', 404);

  // Find the index of the item with the specified itemId in collection.items
  const itemIndex = collection.items.findIndex((item) => item.itemId.equals(itemIdToRemove));

  if (itemIndex === -1) throw new ExpressError('item not found in the collection', 404);

  // Remove the item at the found index
  collection.items.splice(itemIndex, 1);

  // Re-map the idx values for the remaining items
  collection.items.forEach((item, index) => (item.idx = index));

  // Save the collection
  await collection.save();

  return itemIdToRemove; // Return the removed itemId
});

const addItemToWishlist = handleRequest(async (req) => {
  const wishlistId = req.params.wishlistId;

  if (!wishlistId) throw new ExpressError('wishlist ID not provided', 400);

  const itemId = req.params.itemId;
  if (!itemId) throw new ExpressError('item ID not provided', 400);

  const wishlist = await WishlistModel.findById(wishlistId);
  if (!wishlist) throw new ExpressError('wishlist not found', 404);
  if (!wishlist.items) wishlist.items = [];

  const item = await ItemModel.findById(itemId);
  if (!item) throw new ExpressError('item not found', 404);

  item.updatedAt = new Date();

  await item.save();

  if (wishlist.items.length > 31) throw new ExpressError('Oops, Wishlist is full!', 400);
  if (wishlist.items.some((wishlistItem) => wishlistItem.itemId.equals(item._id))) {
    throw new ExpressError('Wishlist already includes this item!', 400);
  }
  wishlist.items.push({ idx: wishlist.items.length, itemId: item._id });
  await wishlist.save();

  return item;
});

const removeItemFromWishlist = handleRequest(async (req) => {
  const wishlistId = req.params.wishlistId;
  if (!wishlistId) throw new ExpressError('Wishlist ID not provided', 400);

  const itemIdToRemove = req.params.itemId;
  if (!itemIdToRemove) throw new ExpressError('item ID not provided', 400);

  const wishlist = await WishlistModel.findById(wishlistId);
  if (!wishlist) throw new ExpressError('Wishlist not found', 404);

  // Find the index of the item with the specified itemId in wishlist.items
  const itemIndex = wishlist.items.findIndex((item) => item.itemId.equals(itemIdToRemove));

  if (itemIndex === -1) throw new ExpressError('item not found in the wishlist', 404);

  // Remove the item at the found index
  wishlist.items.splice(itemIndex, 1);

  // Re-map the idx values for the remaining items
  wishlist.items.forEach((item, index) => (item.idx = index));

  // Save the wishlist
  await wishlist.save();

  return itemIdToRemove; // Return the removed itemId
});

const getItemById = handleRequest(async (req) => {
  const { itemId } = req.params;
  if (!itemId) throw new ExpressError('item ID not provided', 400);

  const item = await ItemModel.findById(itemId);
  if (!item) throw new ExpressError('item not found', 404);

  return item;
});

const updateItemById = handleRequest(async (req) => {
  const { itemId } = req.params;
  if (!itemId) throw new ExpressError('item ID not provided', 400);

  const item = await ItemModel.findByIdAndUpdate(itemId, req.body, { new: true });
  if (!item) throw new ExpressError('item not found', 404);

  return req.body;
});

const deleteItemById = handleRequest(async (req) => {
  const { itemId } = req.params;
  if (!itemId) throw new ExpressError('item ID not provided', 400);

  const item = await ItemModel.findByIdAndDelete(itemId);
  if (!item) throw new ExpressError('item not found', 404);

  return item;
});

module.exports = {
  createItem,
  getItems,
  getItemById,
  addItemToCollection,
  removeItemFromCollection,
  addItemToWishlist,
  removeItemFromWishlist,
  updateItemById,
  deleteItemById,
};
