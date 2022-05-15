const express = require('express');
const InvestmentStatements = require('../models/investmentStatements');
const authenticate = require('../passport.js');

const investmentStatementsRouter = express.Router();

investmentStatementsRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        InvestmentStatements.find({})
            .then((statements) => {
                console.log(req.query.filter);
                const filter = req.query.filter;
                let response;
                switch (filter) {
                    case 'mostRecent':
                        InvestmentStatements.find({ belongsTo: req.user._id, year: new Date().getFullYear() })
                            .populate('belongsTo')
                            .then((recentStatements) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(recentStatements);
                            });
                        break;

                    case 'SEQUENCE_NUMBER':
                        const year = req.query.year;
                        const sequenceNumber = req.query.sequenceNumber;
                        InvestmentStatements.find({  belongsTo: req.user._id, year: year, sequenceNumber: sequenceNumber })
                            .populate('belongsTo')
                            .then((statements) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(statements);
                            });
                        break;
                    default:
                        InvestmentStatements.find({ belongsTo: req.user._id })
                            .populate('belongsTo')
                            .then((statements) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(statements);
                            })
                }

                // res.json(response)

            }, (err) => {
                next(err)
            })
            .catch((err) => {
                next(err)
            });
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        InvestmentStatements.create(req.body)
            .then((statement) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(statement);
            })
    })
    .delete((req, res, next) => {
        InvestmentStatements.remove({})
            .then((deletedStatements) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(deletedStatements);
            }, (err) => next(err))
            .catch((err) => next(err))
    })


module.exports = investmentStatementsRouter;