const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo một đối tượng User 
const collectionSchema = new Schema({
    CollectionNamev2: { type: String, required: true },
    CollectionName: { type: String, required: true },
    ImageURL: { type: Array, required: true },
    CollectionPage: { type: String, required: true },
    Description: { type: String, required: true },
    VideoURL: { type: String, required: true },
  }, { collection: 'collections' });

module.exports = mongoose.model('Collection', collectionSchema);
