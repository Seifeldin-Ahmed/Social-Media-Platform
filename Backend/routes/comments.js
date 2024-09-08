const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const commentsController = require('../controllers/comments');
const isAuth = require('../middleware/is_auth');

router.post('/comment/:postId',
    isAuth,
    body('description').trim().not().isEmpty(),
    commentsController.makeComment
); 

router.delete('/comment/:commentId', isAuth, commentsController.deleteComment);

router.put('/comment/:commentId',
    isAuth,
    body('description').trim().not().isEmpty(),
    commentsController.editComment
);



module.exports = router;
