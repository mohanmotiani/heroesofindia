//routes/events.js
//Initialize an instance of Router class
const router = require('express').Router();
const Event = require('../models/event');

//get the table created for events
Event.sync()
    .then(()=>{
        console.log('Event table created')
    })
    .catch(err => console.log(err));

//Import passport and JwtWebToken library
const passport = require('passport');
const jwt = require('jsonwebtoken');
    
//create event
router.post('/new', (req, res)=>{
    const today = new Date();
    const eventData = {
        name: req.body.name,
        date: req.body.date,
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

    //get events
    router.get('', (req, res)=> {
        //dbevents = [];
        Event.findAll()
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