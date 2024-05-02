const { UserModel } = require('../../models/userModel');
const { CollectionModel } = require('../../models/collectionModel');
const handleRequest = require('../../utils/requestHandler');
const ExpressError = require('../../utils/expressError');

const createUser = handleRequest(async (req) => {
  const { nickname, name } = req.body;

  // Check if nickname or email already exist in the database
  const existingUser = await UserModel.findOne({ $or: [{ nickname }, { name }] });
  if (existingUser) throw new Error('Nickname or email already exists');

  const user = new UserModel(req.body);
  await user.save();
  return user;
});

const getUserBySub = handleRequest(async (req) => {
  const user = await UserModel.findOne({ sub: req.params.sub });

  if (!user) return null; // signal a 204 No Content response;

  return user;
});

const getUserCollections = handleRequest(async (req) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) throw new ExpressError('User not found', 404);

  const collections = await CollectionModel.find({ _id: { $in: user.collections } });
  if (!collections) throw new ExpressError('No collections found for this user', 404);

  return collections;
});

const addCollectionToUser = handleRequest(async (req) => {
  const userId = req.params.id;
  if (!userId) throw new ExpressError('User ID not provided', 400);

  const collectionId = req.params.collectionId;
  if (!collectionId) throw new ExpressError('Collection ID not provided', 400);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  const collection = await CollectionModel.findById(collectionId);

  if (!collection) throw new ExpressError('Collection not found', 404);
  if (!collection.items) collection.items = [];
  if (user.collections.includes(collection._id))
    throw new ExpressError('Collection already added!', 400);
  // if (collection.items.length < 1) throw new ExpressError('Collection is empty, add some items first!', 400);

  user.collections.push(collection._id);
  await user.save();

  return collection;
});

const removeCollectionFromUser = handleRequest(async (req) => {
  const userId = req.params.id;
  if (!userId) throw new ExpressError('User ID not provided', 400);

  const collectionId = req.params.collectionId;
  if (!collectionId) throw new ExpressError('Collection ID not provided', 400);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  const collection = await CollectionModel.findById(collectionId);
  if (!collection) throw new ExpressError('Collection not found', 404);

  user.collections.pull(collection._id);
  await user.save();

  return collection;
});

const getAllUsers = handleRequest(async () => {
  const users = await UserModel.find({});
  if (!users) throw new ExpressError('No users found', 404);

  return users;
});

const updateUser = handleRequest(async (req) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) throw new ExpressError('User not found', 404);

  return user;
});

const deleteUser = handleRequest(async (req) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) throw new ExpressError('User not found', 404);

  // Using the "null" return to signal a 204 No Content response
  return null;
});

module.exports = {
  createUser,
  getUserBySub,
  getUserCollections,
  addCollectionToUser,
  removeCollectionFromUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
