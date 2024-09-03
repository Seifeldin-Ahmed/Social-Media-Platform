const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    caption: String,
    imageUrl: String,
    userId: {type: Schema.Types.ObjectId, required: true, ref:'User'},
    sharedBy: {type: Schema.Types.ObjectId, ref:'User'},
    sharedCaption: String
}, {timestamps: true});

module.exports = mongoose.model('Post', postSchema);
