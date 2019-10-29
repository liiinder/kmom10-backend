var User = require('../models/user');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/project');

var users = [
    new User({
        email: "linderkristoffer@hotmail.com",
        password: "$2a$10$26ydNeRZzg3feCAOkYsyA.iLU3P.SEVyqHLA7nWA3HAS4trwzLpCW",
        name: "Kristoffer",
        birth: "19980428",
        balance: 500,
        stocks: [{
            company: "Discmania",
            amount: 10,
            paid: 190
        },
        {
            company: "Innova",
            amount: 5,
            paid: 102
        },
        {
            company: "Discraft",
            amount: 2,
            paid: 24
        }]
    })
];

users.forEach(function(user, index, users) {
    user.save(function(err, result) {
        if (Object.is(users.length - 1, index)) {
            mongoose.disconnect();
        }
    });
});
