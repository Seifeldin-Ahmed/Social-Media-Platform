const Comment = require('../models/comment');
const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.makeComment = async (req, res, next) =>{
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array(); //keep errors to send it back to the frontend
            throw error;
        }
        const description = req.body.description;
        const postId = req.params.postId;
        const comment = new Comment({description: description, postId: postId, userId: req.userId});
        await comment.save();
        const creator = await User.findOne({_id: req.userId}).select('firstName lastName ProfilePic'); 
        res.status(200).json({ message: 'comment added successfully', comment: comment, creator: creator});
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteComment = async (req, res, next) =>{
    try{
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId)
        if(!comment){
            const error = new Error('Could not find comment');
            error.statusCode = 404;
            throw error; 
        }
        if(comment.userId.toString() !== req.userId){
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({message: 'comment Deleted'});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.editComment = async (req, res, next) =>{
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array(); //keep errors to send it back to the frontend
            throw error;
        }
        const commentId = req.params.commentId;
        const description = req.body.description;
        const comment = await Comment.findById(commentId);
        if(!comment){
            const error = new Error('Could not find comment');
            error.statusCode = 404;
            throw error; 
        }
        if(comment.userId.toString() !== req.userId){
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        comment.description = description;
        await comment.save();
        const creator = await User.findOne({_id: comment.userId}).select('firstName LastName ProfilePic'); 
        res.status(200).json({
            message: 'comment Updated!',
            comment: comment,
            creator: creator
        });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500 ; 
        }
        next(err);
    }
};
