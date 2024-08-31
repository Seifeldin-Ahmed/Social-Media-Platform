const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transport = nodemailer.createTransport(sendgridTransport({
    auth: {api_key: "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" }
}));


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
};

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

};

exports.forgetPassword = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array(); //keep errors to send it back to the frontend
        throw error;
    }
    crypto.randomBytes(3, async (err, buffer) => {
        if(err){
            throw err;
        }
        let resetCode = parseInt(buffer.toString('hex'), 16) % 1000000;
        resetCode = resetCode.toString().padStart(6, '0');
        try {
            const user = await User.findOne({email: req.body.email});
            if(!user){
                const error = new Error('A user with this email could not be found');
                error.statusCode = 401; // not authenticated
                throw error;
            }
            const hashedresetCode = await bcrypt.hash(resetCode, 10);
            user.resetCode = hashedresetCode;
            // 10 min in milliseconds =  600 000
            user.resetCodeExpiration = Date.now() + 600000;
            const result = await user.save();
            transport.sendMail({
                to: req.body.email,
                from: 'system.service.mailer@gmail.com',
                subject: 'Password reset',
                html:`
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="padding: 20px; text-align: center; background-color: #4CAF50; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                      <h2>Password Reset Code</h2>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px; text-align: left;">
                      <p>Dear ${result.firstName},</p>
                      <p>We received a request to reset the password associated with your account. Please use the code below to reset your password. This code is valid for the next 10 minutes:</p>
                      <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">
                        <span style="color: #4CAF50;">${resetCode}</span>
                      </div>
                      <p>To reset your password, enter this code on the password reset page.</p>
                      <p>If you did not request this password reset, please ignore this email. Your account will remain secure.</p>
                      <p>Thank you,</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px; text-align: center; color: #999999; font-size: 12px; background-color: #f9f9f9; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                    </td>
                  </tr>
                </table>
                </body>
                </html>
              `
            });
            res.status(200).json({message:'code sent', userId: result._id.toString()}); 
        }
        catch(err){
            if(!err.statusCode){
                err.statusCode = 500 ; 
            }
            next(err);
        }
    });
};

exports.setNewPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array(); //keep errors to send it back to the frontend
        throw error;
    }
    const password = req.body.password;
    const userId = req.body.userId;
    const resetCode = req.body.resetCode;
    try{
        const user = await User.findOne({_id: userId});
        if(!user){
            const error = new Error('code expired');
            error.statusCode = 404;
            throw error;
        }
        const isEqual = await bcrypt.compare(resetCode, user.resetCode);
        if (!isEqual || user.resetCodeExpiration <= Date.now()) {
            const error = new Error('Code expired or invalid.');
            error.statusCode = 404;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetCode = undefined;
        user.resetCodeExpiration = undefined;
        await user.save();
        res.status(200).json({message:'password reset successfully', userId: result._id.toString()}); 
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500 ; 
        }
        next(err);
    }
};