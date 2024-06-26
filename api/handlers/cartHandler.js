const { UserModel } = require('../../models/userModel');
const { ItemModel } = require('../../models/itemModel');
const ExpressError = require('../../utils/expressError');
const handleRequest = require('../../utils/requestHandler');
const getItemQuantityMap = require('../../utils/getItemQuantityMap'); // Make sure to import it correctly

const addItemToCart = handleRequest(async (req) => {
  const { userId, itemId } = req.params;
  if (!userId || !itemId) throw new ExpressError('User ID or Item ID not provided', 400);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  const item = await ItemModel.findById(itemId);
  if (!item) throw new ExpressError('Item not found', 404);

  if (!user.cart) user.cart = [];

  user.cart.push(itemId);
  await user.save();

  return user.cart;
});

const addItemsToCart = handleRequest(async (req) => {
  const { userId } = req.params;
  if (!userId) throw new ExpressError('User ID not provided', 400);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  const { items } = req.body;
  if (!Array.isArray(items)) throw new ExpressError('Invalid items data', 400);

  if (!user.cart) user.cart = [];

  items.forEach((itemId) => user.cart.push(itemId));

  await user.save();

  return user.cart;
});

const removeItemFromCart = handleRequest(async (req) => {
  const { userId, itemId } = req.params;
  if (!userId || !itemId) throw new ExpressError('User ID or Item ID not provided', 400);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  if (!user.cart || !user.cart.includes(itemId))
    throw new ExpressError('Item not found in the cart', 404);

  const itemIndex = user.cart.findIndex((cartItemId) => cartItemId.toString() === itemId);
  if (itemIndex === -1) throw new ExpressError('Item not found in the cart', 404);

  const currentItemQuantity = getItemQuantityMap(user.cart).get(itemId);
  if (currentItemQuantity > 1) {
    // If quantity is greater than 1, decrement the quantity by 1
    user.cart.splice(itemIndex, 1); // Remove one instance of the item
  } else {
    // If quantity is 1, remove the item completely from the cart
    user.cart.splice(itemIndex, 1);
  }

  await user.save();

  return user.cart;
});

const removeItemsFromCart = handleRequest(async (req) => {
  console.log('req: ', req);
  const { userId } = req.params;
  if (!userId) throw new ExpressError('User ID not provided', 400);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  const { items } = req.body;
  if (!Array.isArray(items)) throw new ExpressError('Invalid items data', 400);

  if (!user.cart) user.cart = [];

  items.forEach((itemId) => {
    if (!user.cart.includes(itemId)) throw new ExpressError('Item not found in the cart', 404);

    const itemIndex = user.cart.findIndex((cartItemId) => cartItemId.toString() === itemId);
    if (itemIndex === -1) throw new ExpressError('Item not found in the cart', 404);

    const currentItemQuantity = getItemQuantityMap(user.cart).get(itemId);
    if (currentItemQuantity > 1) {
      // If quantity is greater than 1, decrement the quantity by 1
      user.cart.splice(itemIndex, 1); // Remove one instance of the item
    } else {
      // If quantity is 1, remove the item completely from the cart
      user.cart.splice(itemIndex, 1);
    }
  });

  await user.save();

  return items;
});

const getUserCart = handleRequest(async (req) => {
  const { userId } = req.params;
  if (!userId) throw new ExpressError('User ID not provided', 400);

  const user = await UserModel.findById(userId).populate('cart');
  if (!user) throw new ExpressError('User not found', 404);

  if (!user.cart) user.cart = [];

  return user.cart;
});

const deleteUserCart = handleRequest(async (req) => {
  const { userId } = req.params;
  if (!userId) throw new ExpressError('User ID not provided', 400);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  const cartItems = user.cart;

  user.cart = [];
  await user.save();

  return cartItems;
});

const updateUserCart = handleRequest(async (req) => {
  const { userId } = req.params;
  if (!userId) throw new ExpressError('User ID not provided', 400);

  const user = await UserModel.findById(userId);
  if (!user) throw new ExpressError('User not found', 404);

  const { cart } = req.body;
  if (!Array.isArray(cart)) throw new ExpressError('Invalid cart data', 400);

  user.cart = cart;
  await user.save();

  return user.cart;
});

const checkout = handleRequest(async (req) => {});

module.exports = {
  addItemToCart,
  addItemsToCart,
  removeItemFromCart,
  removeItemsFromCart,
  getUserCart,
  deleteUserCart,
  updateUserCart,
  checkout,
};
