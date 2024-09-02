const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    caption: String,
    imageUrl: String,
    userId: {type: Schema.Types.ObjectId, required: true, ref:'User'},
    sharedBy: {type: Schema.Types.ObjectId, required: true, ref:'User'}
}, {timestamps: true});

module.exports = mongoose.model('Post', postSchema);
