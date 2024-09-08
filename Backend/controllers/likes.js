const Like = require('../models/like');
const User = require('../models/user');


exports.makeLike = async (req, res, next) =>{
    try {
        const postId = req.params.postId;
        const likeIsExist = await Like.findOne({postId: postId, userId: req.userId});
        if(likeIsExist){
            const error = new Error('Like already exist for that user and that post');
            error.statusCode = 422;
            throw error;
        }
        const like = new Like({postId: postId, userId: req.userId});
        await like.save();
        const creator = await User.findOne({_id: req.userId}).select('firstName lastName ProfilePic'); 
        res.status(200).json({ message: 'like added successfully', like: like, creator: creator});
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteLike = async (req, res, next) =>{
    try{
        const likeId = req.params.likeId;
        const like = await Like.findById(likeId);
        console.log(like);
        if(!like){
            const error = new Error('Could not find like');
            error.statusCode = 404;
            throw error; 
        }
        if(like.userId.toString() !== req.userId){
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        await Like.findByIdAndDelete(like);
        res.status(200).json({message: 'like Deleted'});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

