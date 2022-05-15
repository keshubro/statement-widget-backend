const express = require('express');
const { default: mongoose } = require('mongoose');
const Schema = mongoose.Schema;

const documentTypesSchema = new Schema({
    documentTypeLabel: {
        type: String,
        required: true
    },
    documentTypeNumber: {
        type: String,
         required: true
    }
});

const DocumentTypes = mongoose.model('DocumentTypes', documentTypesSchema);
module.exports = DocumentTypes;