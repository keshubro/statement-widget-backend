const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountsSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    accountHolder: {
        type: String
    },
    accountNumber: {
        type: Number,
        required: true
    },
    accountBalance: {
        type: Number
    },
    currency: {
        type: String
    }
});

const Accounts = mongoose.model('Account', accountsSchema);
module.exports = Accounts;