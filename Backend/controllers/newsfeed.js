const Post = require('../models/post');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');

exports.getPosts = async (req, res, next) => {
    try{
        const user = await User.findById(req.userId).select('following');
        //find posts created by me and posts created by the users i follow
        const posts = await Post.find({
        userId: { $in: [user._id, ...user.following] }
        }).populate('userId', 'firstName lastName').sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Fetched posts successfully',
            posts: posts,
        });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500 ; 
        }
        next(err);
    }
};


exports.createPost = async (req, res, next) => {
    try{
        const caption = req.body.caption;
        let imageUrl;
        if(!req.file){
            imageUrl = req.file.path.replaceAll('\\','/');
        } 
        if(!caption && !imageUrl){
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            throw error;
        }
        const creator = await User.findById(req.userId);
        const post = new Post({caption: caption, imageUrl: imageUrl, userId: creator._id});
        await post.save();
        res.status(201).json({
            message: 'Post created successfully',
            post: post,
            creator: {_id: creator._id, name: creator.name}
        });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500 ; 
        }
        next(err);
    }
};


exports.updatePost  = async (req, res, next) => {
    try{
        const postId = req.params.postId;
        const caption = req.body.caption;
        const post = await Post.findById(postId);
        if(!post){
            const error = new Error('Could not find post');
            error.statusCode = 404;
            throw error; 
        }
        if(post.userId.toString() !== req.userId){
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        if(req.file){
            clearImage(post.imageUrl, next);
            post.imageUrl = req.file.path.replaceAll('\\','/');
        }
        if(caption){
            post.caption = caption;
        }
        const result = await post.save();
        res.status(200).json({
            message: 'post Updated!',
            post: result
        });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500 ; 
        }
        next(err);
    }
};


exports.deletePost = async (req, res, next) => {
    try{
        const postId = req.params.postId;
        const post = await Post.findById(postId)
        if(!post){
            const error = new Error('Could not find post');
            error.statusCode = 404;
            throw error; //we are in async code, so this throw will go to the catch block
        }
        if(post.userId.toString() !== req.userId){
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        clearImage(post.imageUrl, next);
        await Post.findByIdAndDelete(postId);
        res.status(200).json({message: 'post Deleted'});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

const clearImage = (filePath, next) => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, (err) =>{ 
        if(err){
            next (err);
        }
    });
};
