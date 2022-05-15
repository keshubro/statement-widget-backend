const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config.js');
const Users = require('../models/user');
const authenticate = require('../passport.js');

const authRouter = express.Router();


authRouter.post('/login', passport.authenticate('local'), function(req, res) {
    // Will enter here if the authentication is successful

    var token = authenticate.getToken({_id: req.user._id}); // Creating a JWT token
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in', token: token}); // Pass the JWT token to the client
});

authRouter.post('/signup', (req, res, next) => {
    Users.register(new Users({ username: req.body.username }), req.body.password, (err, user) => {
        if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        }
        else {
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'Registration Successful !'})
            })
        }
    })
});

authRouter.get('/logout', (req, res, next) => {
    if(req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/login');
    }
    else {
        var err = new Error('You are not logged in');
        err.statusCode = 403;
        next(err);
    }
})

module.exports = authRouter;