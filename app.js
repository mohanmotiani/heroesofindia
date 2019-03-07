const express = require('express');
const cp = require('cookie-parser');
const bp = require('body-parser');
require('dotenv').config();

//const mongoose = require('mongoose');

const passport = require('passport');
const app = express();

const port = process.env.PORT || 3000;
// const dbPort = process.env.dbPort || 27017;
// const dbUrl = process.env.DB_URL || "localhost";
// const dbCollection = process.env.DB_COLLECTION || "auth-test";

// mongoose.set('useCreateIndex', true);
// mongoose.connect(`mongodb://${dbUrl}/${dbCollection}`, {useNewUrlParser: true})
//     .then(_ => console.log('Connected Successfully to MongoDB'))
//     .catch(err => console.log(err));

app.use(passport.initialize());

require('./passport-config')(passport);

app.use(cp());
app.use(bp.urlencoded({extended: false}));
app.use(bp.json());

//middleware to log traffic
app.use((req, res, next)=>{
    console.log(req.body);
    if(req.body) console.log(req.body);
    if (req.params) console.log(req.params);
    if(req.query) console.log(req.query);
    console.log(`Received a ${req.method} request from ${req.ip} for ${req.url}`);
    next();
});

//enable CORS

app.use((req,res, next)=>{
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
    res.header("Access-Control-Allow-Headers",
            "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization");
    next();
});

/* GET users listing. */
app.get('/', function (req, res) {
    res.send('<h1>Hello there!</h1>');
});

//serve apis 
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'))

app.listen(port, err => {
    if(err) console.error(err);
    console.log(`Listening for Requests on port: ${port}`);
});

module.exports = app;
