const Post = require('../models/post');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

exports.getPosts = async (req, res, next) => {
    try {
        const currentPage = +req.query.page || 1;
        const postsPerPage = 10;
        // Get the current user and their following list
        const user = await User.findById(req.userId).select('following');
        if(!user){
            const error = new Error('A user with this id could not be found');
            error.statusCode = 401; // not authenticated
            throw error;
        }
        const followingUsers = [user._id, ...user.following]; 

        // Aggregation pipeline to fetch posts with comments and likes
        const posts = await Post.aggregate([
            {
                $match: {
                    userId: { $in: followingUsers } 
                }
            },
            {
                $sort: { createdAt: -1 } // Sort by creation date in descending order
            },
            {
                $skip: (currentPage - 1) * postsPerPage // Skip the specified number of documents
            },
            {
                $limit: postsPerPage // Limit the results to the specified number of documents
            },
            {
                $lookup: {
                    from: 'users', // Lookup user details from User collection
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' }, // Unwind the user details array
            {
                $lookup: {
                    from: 'users', // Lookup user details from User collection
                    localField: 'sharedBy',
                    foreignField: '_id',
                    as: 'sharedByUserDetails'
                }
            },
            { 
                $unwind:{
                    path: '$sharedByUserDetails',
                    preserveNullAndEmptyArrays: true
                }
            }, 
            {
                $lookup: {
                    from: 'comments', // Lookup comments for each post
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'comments'
                }
            },
            {
                $lookup: {
                    from: 'users', // Populate user details for each comment
                    localField: 'comments.userId',
                    foreignField: '_id',
                    as: 'commentUserDetails'
                }
            },
            {
                $lookup: {
                    from: 'likes', // Lookup likes for each post
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'likes'
                }
            },
            {
                $lookup: {
                    from: 'users', // Populate user details for each like
                    localField: 'likes.userId',
                    foreignField: '_id',
                    as: 'likeUserDetails'
                }
            },
            {
                $project: {
                    _id: 1,
                    caption: 1,
                    imageUrl: 1,
                    createdAt: 1,
                    creatorDetails: { // Include only specific fields from userDetails
                        _id: '$userDetails._id',
                        firstName: '$userDetails.firstName',
                        lastName: '$userDetails.lastName',
                        ProfilePic: '$userDetails.ProfilePic'
                    },
                    sharedByUserDetails: {
                        _id: '$sharedByUserDetails._id',
                        firstName: '$sharedByUserDetails.firstName',
                        lastName: '$sharedByUserDetails.lastName',
                        ProfilePic: '$sharedByUserDetails.ProfilePic'
                    },
                    comments: {
                        $map: {
                            input: {
                                $sortArray: { input: '$comments', sortBy: { createdAt: 1 } } // Sort comments by createdAt
                            },
                            as: 'comment',
                            in: {
                                _id: '$$comment._id',
                                description: '$$comment.description',
                                createdAt: '$$comment.createdAt',
                                userId: '$$comment.userId',
                                userFirstName: {
                                    $arrayElemAt: [
                                        '$commentUserDetails.firstName',
                                        { $indexOfArray: ['$commentUserDetails._id', '$$comment.userId'] }
                                    ]
                                },
                                userLastName: {
                                    $arrayElemAt: [
                                        '$commentUserDetails.lastName',
                                        { $indexOfArray: ['$commentUserDetails._id', '$$comment.userId'] }
                                    ]
                                },
                                userProfilePic: {
                                    $arrayElemAt: [
                                        '$commentUserDetails.ProfilePic',
                                        { $indexOfArray: ['$commentUserDetails._id', '$$comment.userId'] }
                                    ]
                                }
                            }
                        }
                    },
                    likes: {
                        $map: {
                            input: '$likes',
                            as: 'like',
                            in: {
                                _id: '$$like._id',
                                userId: '$$like.userId',
                                userFirstName: {
                                    $arrayElemAt: [
                                        '$likeUserDetails.firstName',
                                        { $indexOfArray: ['$likeUserDetails._id', '$$like.userId'] }
                                    ]
                                },
                                userLastName: {
                                    $arrayElemAt: [
                                        '$likeUserDetails.lastName',
                                        { $indexOfArray: ['$likeUserDetails._id', '$$like.userId'] }
                                    ]
                                },
                                userProfilePic: {
                                    $arrayElemAt: [
                                        '$likeUserDetails.ProfilePic',
                                        { $indexOfArray: ['$likeUserDetails._id', '$$like.userId'] }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);

        // Format the createdAt fields using moment.js
        const formattedPosts = posts.map(post => ({
            ...post,
            createdAt: moment(post.createdAt).fromNow(), // Format createdAt for posts
            comments: post.comments.map(comment => ({
                ...comment,
                createdAt: moment(comment.createdAt).fromNow(), // Format createdAt for comments
            })),
        }));
        
        res.status(200).json({
            message: 'Fetched posts successfully',
            posts: formattedPosts,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createPost = async (req, res, next) => {
    try{
        const caption = req.body.caption;
        let imageUrl;
        if(req.file){
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
            creator: {_id: creator._id, firstName: creator.firstName , lastName: creator.lastName}
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
