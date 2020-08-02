const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'mydefaultsecret';


//verify token middleware

function verifyToken(req, res) {
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