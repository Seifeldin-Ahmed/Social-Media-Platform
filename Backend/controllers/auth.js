const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array(); //keep errors to send it back to the frontend
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const gender = req.body.gender;
    const dateOfBirth = req.body.dataOfBirth;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    let ProfilePic;  
    if(!req.file){
        if(gender === "female"){
            ProfilePic = 'images/female.jpg';
        } else {
            ProfilePic = 'images/male.jpg';
        } 
    } else {
        ProfilePic = req.file.path.replaceAll('\\','/');
    }
    try{
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({firstName: firstName, lastName: lastName, email: email, passwrod: hashedPassword, gender: gender, dateOfBirth: dateOfBirth, ProfilePic: ProfilePic})
        const result = await user.save();
        res.status(201).json({message: 'User created!', userId: result._id.toString()});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500 ; 
        }
        next(err);
    }
}

exports.login = async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array(); //keep errors to send it back to the frontend
        throw error;
    }
    const email = req.body.email;
    try{
        const user = await User.findOne({email: email})
        if(!user){
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401; // not authenticated
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);    
        if(!isEqual){
            const error = new Error('Wrong password!');
            error.statusCode = 401; // not authenticated
            throw error;
        }
        const token = jwt.sign({email: user.email, userId: user._id.toString()}, 'strongsupersupersecretsecret', {expiresIn: '2h'});
        res.status(200).json({token: token, userId: user._id.toString()}); 
    } 
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500 ; 
        }
        next(err);
    }

}