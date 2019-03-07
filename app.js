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

// /* GET users listing. */
// app.get('/', function (req, res) {
//     res.send('<h1>Hello there!</h1>');
// });

//serve apis 
app.use('/users', require('./routes/users'));

app.listen(port, err => {
    if(err) console.error(err);
    console.log(`Listening for Requests on port: ${port}`);
});

module.exports = app;
