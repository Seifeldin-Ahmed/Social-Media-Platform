const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    description: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, required: true, ref:'User'},
    postId: {type: Schema.Types.ObjectId, required: true, ref:'Post'},
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);
