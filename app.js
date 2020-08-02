const express = require('express');
const chalk = require('chalk');
// const fs = require('fs');
var cors = require('cors');

require('./database/db');

const config = require('./config');

const cp = require('cookie-parser');
const bp = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

// require('dotenv').config();
// const secret = process.env.SECRET || 'mydefaultsecret';

//const mongoose = require('mongoose');

const passport = require('passport');
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

const port = process.env.PORT || 3000;

app.use(passport.initialize());

require('./passport-config')(passport);

app.use(cp());
app.use(bp.urlencoded({extended: false}));
app.use(bp.json());

//middleware to log traffic
// app.use((req, res, next)=>{
//     console.log(req.body);
//     if(req.body) console.log(req.body);
//     if (req.params) console.log(req.params);
//     if(req.query) console.log(req.query);
//     console.log(`Received a ${req.method} request from ${req.ip} for ${req.url}`);
//     next();
// });

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
// app.get('/', function (req, res) {
//     res.sendFile('index.html');
//     // res.send('<h1>Hello there!</h1>');
// });


//serve apis 
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'))
app.use('/api/leads', require('./routes/leads'))

app.get('*', cors(), (req, res) => {
  //  res.send('<h1>Hello there!</h1>');

  res.sendFile(path.join(__dirname,'dist/index.html'));
});

app.listen(port, err => {
    if(err) console.error(err);
    console.log(`Listening for Requests on port: ${port}`);
});

module.exports = app;
