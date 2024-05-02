const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'collection' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    items: [
      {
        idx: { type: Number, required: true },
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
      },
    ],
  },
  { timestamps: true }
);

const WishlistModel = mongoose.model('wishlist', wishlistSchema);

module.exports = { WishlistModel };
