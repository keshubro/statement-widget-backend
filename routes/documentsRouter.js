const express = require('express');
// const mongoURI = require('../config').mongoUrl;
const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/justUploads';

// Mongo connection
const connect = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

connect.once('open', () => {
    // Init stream
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: 'files'
    });
});

const documentsRouter = express.Router();

documentsRouter.route('/')
    .get((req, res, next) => {
        gfs.find({})
            .toArray((err, files) => {
                if (!files || files.length === 0) {
                    return res.status(404).json({
                        err: "No files exist"
                    });
                }

                return res.json(files);
            });
    });


module.exports = documentsRouter;