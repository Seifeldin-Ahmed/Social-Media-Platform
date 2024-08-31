const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gender: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    ProfilePic: {type: String, required: true},
    resetCode: String,
    resetCodeExpiration: Date,
    posts: [{type: Schema.Types.ObjectId, required: true, ref: 'Post'}],
    followers: [{type: Schema.Types.ObjectId, required: true, ref: 'User'}],
    following: [{type: Schema.Types.ObjectId, required: true, ref: 'User'}],
});

module.exports = mongoose.model('User',userSchema);