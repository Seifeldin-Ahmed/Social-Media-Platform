const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose =  require('mongoose');
const multer = require('multer');
const authRoutes = require('./routes/auth');


const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replaceAll(':', '-') + '_' + file.originalname); // unique filename
    }
});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const MONGODB_URL = 'mongodb+srv://SeifAhmed:seif9517535@cluster0.agaemyt.mongodb.net/socialmedia?retryWrites=true&w=majority&appName=Cluster0';

app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use('/images',express.static(path.join(__dirname,'images')));

app.use((req, res, next) => { //solve CORS Problem
    res.setHeader('Access-Control-Allow-Origin', '*'); //modify the response and add a new headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}); 

app.use(authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500; //incase of statusCode undifned so it will take the value of 500 
    const message = error.message; 
    const data = error.data;
    res.status(status).json({message: message, data: data});
});

mongoose.connect(MONGODB_URL)
.then(() => {
    app.listen(4000);
})
.catch(err => console.log(err));
