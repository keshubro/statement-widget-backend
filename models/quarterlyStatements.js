const express = require('express');
const { default: mongoose } = require('mongoose');
const Users = require('./user');
const Schema = mongoose.Schema;

const detailsSchema = new Schema({
    label: String,
    value: String
});

const quarterlyStatementsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: [detailsSchema],
    dateOfReceipt: {
        type: String,
        required: true
    },
    sequenceNumber: {
        type: Number,
        required: true
    },
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    filename: {
        type: String,
        required: true
    }
});

const QuarterlyStatementsModel = mongoose.model('QuarterlyStatements', quarterlyStatementsSchema);
module.exports = QuarterlyStatementsModel;