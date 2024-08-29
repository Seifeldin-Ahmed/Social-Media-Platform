const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const User = require('../models/user');
const authController = require('../controllers/auth');

router.put('/signup',
    body('email').isEmail().withMessage('Plase enter a vaild email.').custom((value, { req }) => {
        return User.findOne({email: value})
               .then(userDoc => {
                    if(userDoc){
                        return Promise.reject('E-mail address already exists!');
                    }
               });
    }).normalizeEmail(),
    body('password').trim().isLength({min: 7}).matches(/[A-Z]/).withMessage('at least one uppercase letter required').matches(/\d/).withMessage('at least one number required'),
    body('fistName').trim().not().isEmpty().isLength({min:3}),
    body('lastName').trim().not().isEmpty().isLength({min:3}),
    body('gender').trim().not().isEmpty(),
    body('dateOfBirth').not().isEmpty().isDate().withMessage('Invalid date format. Please enter a valid date (YYYY-MM-DD).'),
    authController.signup);

router.post('/login',
    body('email').isEmail().withMessage('please enter a valid email.').normalizeEmail(),
    authController.login);

module.exports = router;