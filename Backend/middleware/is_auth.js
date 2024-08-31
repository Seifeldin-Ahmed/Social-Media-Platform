const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('Not authenticated.')
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'strongsupersupersecretsecret');
    }
    catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){ //this would be the case if it didn't fail technically but it was unable to verify the token (which means invalid token)
        const error = new Error('Not authenticated.')
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId; //store the user id of the token at current request
    next();
}