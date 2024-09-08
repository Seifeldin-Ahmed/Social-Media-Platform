const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const isAuth = require('../middleware/is_auth');

router.post('/share/:postId', isAuth, userController.sharePost); 

router.patch('/share/:postId', isAuth, userController.editSharedPost);

router.delete('/share/:postId',  isAuth, userController.deleteSharedPost);


module.exports = router;
