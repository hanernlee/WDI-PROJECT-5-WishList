var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var ItemSchema = new Schema({
    user_id: { type: String, required: true, index: { unique: true } },
    name: { type: String, required: true, index: { unique: true } },
    imageUrl: { type: String, required: true, index: { unique: true } },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }
});

module.exports = mongoose.model('Item', ItemSchema);
