const express = require('express');
const authenticate = require('../passport.js');
const QuarterlyStatements = require('../models/quarterlyStatements');

const quarterlyStatementsRouter = express.Router();

quarterlyStatementsRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        QuarterlyStatements.find({})
            .then((statements) => {
                const filter = req.query.filter;
                switch(filter) {
                    case 'mostRecent':
                        QuarterlyStatements.find({ belongsTo: req.user._id })
                            .populate('belongsTo')
                            .then((recentStatements) => {
                                const filteredStatements = recentStatements.filter((stmt) => {
                                    const stmtYear = stmt.dateOfReceipt.substring(0, 4);
                                    return parseInt(stmtYear, 10) === new Date().getFullYear();
                                });
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(filteredStatements);
                            });
                        break;

                    case 'quarter':
                        const quarter = req.query.quarter;
                        const year = req.query.year;

                        QuarterlyStatements.find({ belongsTo: req.user._id })
                            .populate('belongsTo')
                            .then((stmts) => {
                                const filteredStatements = stmts.filter((stmt) => {
                                    const stmtQuarter = stmt.dateOfReceipt.substring(4, 6);
                                    return (Math.floor(parseInt(stmtQuarter, 10)/4) === (quarter - 1));
                                });
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(filteredStatements);
                            });
                        break;

                    case 'dateRange':
                        const startDate = req.query.startDate;
                        const endDate = req.query.endDate;

                        break;

                    default:
                        QuarterlyStatements.find({})
                            .populate('belongsTo')
                            .then((recentStatements) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(recentStatements);
                            });

                        
                }
            })
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        QuarterlyStatements.create(req.body)
            .then((statement) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(statement);
            })
    })
    .delete((req, res, next) => {
        QuarterlyStatements.remove({})
            .then((deletedStatements) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(deletedStatements);
            }, (err) => next(err))
            .catch((err) => next(err))
    });

module.exports = quarterlyStatementsRouter;