//routes/leads.js
//Initialize an instance of Router class
const router = require('express').Router();
const Lead = require('../models/lead.js');
const secret = process.env.SECRET || 'mydefaultsecret';

//get the table created for events
Lead.sync({force: true})
    .then(()=>{
        console.log('Lead table created')
    })
    .catch(err => console.log(err));

//Import passport and JwtWebToken library
const passport = require('passport');
const jwt = require('jsonwebtoken');

//verify token
function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        res.status(401).send('Unauthorized request');
    }
    
    let token = req.headers.authorization.split(' ')[1];
    if(token === 'null') {
        res.status(401).send('Unauthorized request');
    }
    let payload = jwt.verify(token, secret)
    if(!payload) {
        res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject;
    next();
}
//creat a new lead 
router.post('/new', (req, res)=>{
    const today = new Date();
    const leadData = {
        title: req.body.title,
        description: req.body.description,
        createDate: today
    };

    Lead.create(leadData)
        .then(lead => {
            res.status(200).json(lead);
        })
        .catch(err => {
            console.log('Error creating lead. Error: '+ err);
            res.status(400).json({"success": false});
        });
    });

    //get leads
    router.get('', (req, res)=> {
        Lead.findAll({
            where: 
                {
                }
            }
        )
        .then(leads => {
            res.status(200).json(leads);
        })
        .catch(err => {
            console.log('error getting leads from db. Error: '+ err);
            res.status(400).json({"success": false});
        })
    });

    
module.exports = router;