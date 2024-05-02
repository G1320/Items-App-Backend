const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'collection' }], // Array of refs to collections that contain this item
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: false },
  imgUrl: { type: String, required: false },
  idx: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ItemModel = mongoose.model('item', itemSchema);

module.exports = { ItemModel };
