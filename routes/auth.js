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

function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];
    const jwt = require('jsonwebtoken');
    let data = {
        msg: ""
    };

    jwt.verify(token, process.env.JWT_SECRET, function (err) {
        if (err) {
            data.msg = "Invalid Token";
            res.status(401).json(data);
        } else {
            next();
        }
    });
}

async function updateUser(res, req) {
    deposit = (req.deposit == "") ? "0" : req.deposit;
    console.log(req.deposit);
    console.log(deposit);
    console.log("balance");
    console.log(req.user.balance);
    console.log(+req.user.balance + +deposit);
    console.log("tresasdlajksdlöasdk");
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
    console.log(formated);
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
