const express = require('express');
const DocumentTypes = require('../models/documentTypes');

const documentTypeRouter = express.Router();

documentTypeRouter.route('/')
    .get((req, res, next) => {
        DocumentTypes.find({})
        .then((documentTypes) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(documentTypes);
        }, (err) => next(err))
        .catch((err) => next(err))
    })
    .post((req, res, next) => {
        DocumentTypes.create(req.body)
        .then((documentType) => {
            res.statusCode = 200;
            res.setHeader('Conten-Type', 'application/json');
            res.json(documentType);
        })
    });


module.exports = documentTypeRouter;