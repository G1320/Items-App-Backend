const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  items: [
    {
      idx: { type: Number, required: true },
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
    },
  ],
});

const CollectionModel = mongoose.model('collection', collectionSchema);

module.exports = { CollectionModel };
