const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    nickname: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    name: { type: String, required: true },
    avatar: { type: String }, // URL to user's avatar
    password: { type: String, select: false },
    picture: { type: String },
    sub: { type: String, unique: true },
    updated_at: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'collection' }],
    wishlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'wishlist' }], // Array of wishlist references
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'item' }], // Array of item references
  },
  { timestamps: true }
);

const UserModel = mongoose.model('user', userSchema);

module.exports = { UserModel };
