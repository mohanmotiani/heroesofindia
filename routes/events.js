//routes/events.js
//Initialize an instance of Router class
const router = require('express').Router();
const Event = require('../models/event');
const secret = process.env.SECRET || 'mydefaultsecret';
var cors = require('cors');
router.use(cors());
//get the table created for events
Event.sync({force: false})
    .then(()=>{
        console.log('Event table created')
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
//create event
router.post('/new', (req, res)=>{
    const today = new Date();
    const eventData = {
        name: req.body.name,
        date: req.body.date,
        description: req.body.description,
        price: req.body.price,
        special: req.body.special,
        created: today
    };

    Event.create(eventData)
        .then(event => {
            res.status(200).json(event);
        })
        .catch(err => {
            console.log('Error creating event. Error: '+ err);
            res.status(400).json({"success": false});
        });
    });

    //get general events
    router.get('', (req, res)=> {
        //dbevents = [];
        Event.findAll({
            where: 
                {
                    special: false
                }
            }
        )
        .then(events => {
          //  dbevents = events;
            res.status(200).json(events);
        })
        .catch(err => {
            console.log('error getting events from db. Error: '+ err);
            res.status(400).json({"success": false});
        })
    });

        //get special events
        router.get('/members', verifyToken, (req, res)=> {
            //dbevents = [];
            Event.findAll({
                where: 
                    {
                        special: true
                    }
                }
            )
            .then(events => {
              //  dbevents = events;
                res.status(200).json(events);
            })
            .catch(err => {
                console.log('error getting events from db. Error: '+ err);
                res.status(400).json({"success": false});
            })
        });
    
module.exports = router;