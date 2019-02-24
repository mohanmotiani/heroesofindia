// const {Strategy, ExtractJwt} = require('passport-jwt');
const pp_jwt = require('passport-jwt');
const Strategy = pp_jwt.Strategy;
const ExtractJwt = pp_jwt.ExtractJwt;

require('dotenv').config();

const secret = process.env.SECRET || 'mydefaultsecret';
const mongoose = require('mongoose');

const User = require('./models/user');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};
module.exports = passport => {
    passport.use(
        new Strategy(opts, (payload, done) => {
            User.findById(payload.id)
            .then(user => {
                if(user){
                    return done(null,{
                        id:nuser.id,
                        name: user.name,
                        email: user.email
                    });
                }
                return done(null, false);
            }).catch(err=>console.error(err));
        })
    );
};