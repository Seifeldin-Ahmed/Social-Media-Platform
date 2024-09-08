const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likes');
const isAuth = require('../middleware/is_auth');

router.post('/like/:postId', isAuth, likesController.makeLike); 

router.delete('/like/:likeId', isAuth, likesController.deleteLike);

module.exports = router;
