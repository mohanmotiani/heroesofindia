//routes/users.js
//Initialize an instance of Router class
const router = require('express').Router();
var cors = require('cors');
//import BcryptJS tool and user model
const User = require('../models/user');
const bcrypt = require('bcryptjs');
//get the table created for user

User.sync()
    .then(()=>{
        console.log('User table created')
    })
    .catch(err => console.log(err));

//get access to environment variables and get the secret key
require('dotenv').config();
const secret = process.env.SECRET || 'mydefaultsecret';


//configure CORS

//Setup CORS 
// router.use((req,res, next)=>{
//     //Enabling CORS
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
//     res.header("Access-Control-Allow-Headers",
//             "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization");
//     next();
// });

//Import passport and JwtWebToken library
const passport = require('passport');
const jwt = require('jsonwebtoken');



//router testing
router.use(cors());
router.get('', 
    (req, res) => {
        res.status(200).json({"success": true})
    });
    
//register user
router.post('/register', (req, res)=>{
    res.status(200).json({
        success: true,
        token: 'token'
    });
    return;
    const today = new Date();
    const userData = {
        first_name: req.body.fname || 'ABCD',
        last_name: req.body.lname || 'XYZ',
        email: req.body.email,
        password: req.body.password,
        create: today
    };
    
    User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user=>{
            //if user is found - return error message
            if(!user){
                const hash = bcrypt.hashSync(userData.password, 10);
                userData.password = hash;
                User.create(userData)
                .then(user => {
                    let token = jwt.sign(user.dataValues, secret, {
                        expiresIn: 1440
                    })
                    res.status(200).json({
                        success: true,
                        token: `Bearer ${token}`
                    });
                })
                .catch(err => {
                    res.status(400).json({'error': err});
                })
            } else {
                let error = 'User already registered with this email address';
                res.status(400).json({'error': err});
            }
        })
        .catch(err =>{
            res.status(400).json({'error': err})
        })
});

router.post('/login', (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    let errors = {};
    User.findOne({
        where: {
            email: email
        }
        })
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