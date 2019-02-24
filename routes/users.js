//routes/user.js
//Initialize an instance of Router class
const router = require('express').Router();

//import BcryptJS tool and user model
const User = require('../models/user');
const bcrypt = require('bcryptjs');

//get access to environment variables and get the secret key
require('dotenv').config();
const secret = process.env.SECRET || 'mydefaultsecret';

//Import passport and JwtWebToken library
const passport = require('passport');
const jwt = require('jsonwebtoken');

//register user

router.post('/register', (req, res)=>{
    User.findOne({emailAddress: req.body.emailAddress})
        .then(user=>{
            if(user){
                let error = 'User already registered with this email address';
                return res.status(400).json(error);
            } else {
                const newUser = new User ({
                    userName: req.body.name,
                    emailAddress: req.body.emailAddress,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt)=>{
                    if(err) throw err;
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => res.json({"success": true}))
                            .catch(err => res.json(400).json(err));
                    });
                });
            }
        });
});

router.post('/login', (req, res)=>{
    const email = req.body.emailAddress;
    const password = req.body.password;
    let errors = {};
    User.findOne({emailAddress: email})
        .then(user => {
            if(!user){
                errors.email = "No Account found";
                return res.status(404).json(errors);
            }
            bcrypt.compare(password,user.password)
                .then(isMatch=>{
                    if(isMatch){
                        const payload = {
                            id: user._id,
                            name: user.name
                        };
                        jwt.sign(payload, secret, {expiresIn: 36000},(err, token)=>{
                            if(err) res.status(500).json({
                                error: 'Error signing token',
                                raw: err
                            });
                            res.json({
                                success: true,
                                token: `Bearer ${token}`
                            });
                        });
                    } else {
                        errors.password = "Password is incorrect";
                        res.status(400).json(errors);
                    }
                });
        });
});

module.exports = router;