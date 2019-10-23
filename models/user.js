var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    name: String,
    birth: String,
    balance: String,
    transactions: [{
        company: String,
        date: Date,
        amount: Number,
        price: Number
    }]
});

module.exports = mongoose.model('users', userSchema);