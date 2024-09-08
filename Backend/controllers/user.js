const User = require('../models/user');
const Post = require('../models/post');

exports.sharePost = async (req, res, next) =>{
    try {
        const sharedCaption = req.body.sharedCaption;
        const postId = req.params.postId;
        const post = await Post.findOne({_id: postId});
        if(!post){
            const error = new Error('A post with this id could not be found');
            error.statusCode = 404;
            throw error;
        }
        const { _id, ...postWithoutId } = post._doc;
        const sharedPost = new Post({ ...postWithoutId, sharedBy: req.userId, sharedCaption: sharedCaption });
        await sharedPost.save();
        const creator = await User.findOne({_id: req.userId}).select('firstName lastName ProfilePic'); 
        res.status(200).json({ message: 'like added successfully', sharedPost: sharedPost, creator: creator});
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.editSharedPost = async (req, res, next) =>{
    try {
        const sharedCaption = req.body.sharedCaption;
        const postId = req.params.postId;
        const post = await Post.findOne({_id: postId});
        if(!post){
            const error = new Error('Post not Found');
            error.statusCode = 404;
            throw error;
        }
        if(post.sharedBy.toString() !== req.userId){
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        post.sharedCaption = sharedCaption;
        await post.save();
        const creator = await User.findOne({_id: req.userId}).select('firstName lastName ProfilePic'); 
        res.status(200).json({ message: 'like added successfully', post: post, creator: creator});
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.deleteSharedPost = async (req, res, next) =>{
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(!post){
            const error = new Error('Post not Found');
            error.statusCode = 404;
            throw error;
        }
        if(post.sharedBy.toString() !== req.userId){
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        await Post.findByIdAndDelete(postId);
        res.status(200).json({message: 'comment Deleted'});
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};