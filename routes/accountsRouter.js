const express = require('express');
const Accounts = require('../models/accounts.js');

const accountsRouter = express.Router();

accountsRouter.route('/')
    .get((req, res, next) => {
        Accounts.find({})
        .then((accounts) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(accounts);
        }, (err) => {
            next(err);
        })
        .catch((err) => {
            next(err);
        })
    })
    .post((req, res, next) => {
        Accounts.create(req.body)
        .then((account) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(account);
        })
    });


module.exports = accountsRouter;
