const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const newsfeedController = require('../controllers/newsfeed');
const isAuth = require('../middleware/is_auth');

router.get('/posts', isAuth, newsfeedController.getPosts); 

router.post('/post', isAuth, newsfeedController.createPost);

router.put('/post/:postId', isAuth, newsfeedController.updatePost);

router.delete('/post/:postId', isAuth, newsfeedController.deletePost);


exports.module = router;