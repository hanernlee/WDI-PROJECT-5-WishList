var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var ItemSchema = new Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    start: { type: String, required: true },
    status: { type: String, required: true },
    end: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }
});

module.exports = mongoose.model('Item', ItemSchema);
