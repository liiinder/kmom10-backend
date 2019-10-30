const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');

router.get('/', function (req, res) {
    res.status(200).json({ data: { msg: "Main route works" } });
});

router.post("/update",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => updateUser(res, req.body));

router.post("/stock",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => stock(res, req.body));

function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];
    const jwt = require('jsonwebtoken');
    let data = {
        msg: ""
    };

    jwt.verify(token, process.env.JWT_SECRET, function (err) {
        if (err) {
            data.msg = "Invalid Token";
            console.log(token);
            console.log("error");
            res.status(401).json(data);
        } else {
            next();
        }
    });
}

async function stock(res, req) {
    console.log(req);
    const user = await User.findOne({ email: req.email });
    if (user.balance < req.price) {
        res.status(400).json({ msg: "Inte tillräckligt med pengar" });
    } else {
        let check = true;
        user.stocks.forEach((stock) => {
            if (stock.company == req.company) {
                if (stock.amount == 0 && req.amount < 0) {
                    res.status(400).json({ msg: "Finns inga aktier att sälja" });
                } 
                user.balance -= req.amount * req.price;
                console.log("req.amount");
                console.log(req.amount);
                if (req.amount > 0){
                    stock.paid += (req.amount * req.price);
                } else {
                    stock.paid = (stock.paid / stock.amount) * (stock.amount + req.amount);
                }
                stock.amount += req.amount;
                check = false;
            }
        });
        if (check) {
            user.stocks.push({
                company: req.company,
                amount: req.amount,
                paid: req.amount * req.price
            });
        }
        user.save();
        let transaction = (req.amount > 0) ? "Köp" : "Sälj";

        res.status(200).json({ user: user, msg: `${transaction} genomfört av ${req.company}`});
    }
}

async function updateUser(res, req) {
    deposit = (req.deposit == "") ? "0" : req.deposit;

    await User.update({ email: req.user.email },
        { $set: {
            name: req.name,
            birth: req.birth,
            balance: (+req.user.balance + +deposit)
        }
    });

    User.findOne({ email: req.user.email }, function(err, user) {
        if (err) {
            console.log(err);
            return res.status(400).json({ msg: "Error" });
        } else if (!user) {
            return res.status(404).json({ msg: "Email not found" });
        } else {
            console.log("Updated user");
            // console.log(user);
            res.status(200).json({
                msg: "Successfully Updated",
                user: user,
            });
        }
    });
}

function formatedDate() {
    let d = new Date()
    let formated = d.getFullYear() +
        ('0' + (d.getMonth() + 1)).slice(-2) +
        ('0' + d.getDate()).slice(-2);
    // console.log(formated);
    return formated
}

router.post('/register', function (req, res) {
    const saltRounds = 10;
    let newuser = new User();

    newuser.email = req.body.email;
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            res.status(400).json({ msg: "Error in the password hash"});
        } else {
            newuser.password = hash;
            newuser.name = "";
            newuser.birth = formatedDate();
            newuser.balance = "0";
            newuser.stocks = [];
            newuser.save(function (err, savedUser) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ msg: "Email already registered" });
                }

                return res.status(200).json({ msg: "Successfully registered" });
            })
        }
    });
});

router.post('/login', function(req, res) {
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET;

    User.findOne({ email: req.body.email}, function(err, user) {
        if(err) {
            console.log(err);
            return res.status(400).json({ msg: "Error" });
        } else if (!user) {
            return res.status(404).json({ msg: "Email not found" });
        } else {
            bcrypt.compare(req.body.password, user.password, function (err, bcryptRes) {
                if ((err) || (!bcryptRes)) {
                    res.status(400).json({ msg: "Invalid password" });
                } else {
                    res.status(200).json({
                        msg: "Signed in",
                        user: user,
                        token: jwt.sign({ email: req.body.email }, secret, { expiresIn: '1h' })
                    });
                }
            });
        }
    });
});

module.exports = router;
