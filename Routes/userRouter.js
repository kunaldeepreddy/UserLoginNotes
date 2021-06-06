const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
var CONSTANT = require('./../constant.js');
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const mongoose = require("mongoose");

router.post('/register', (req, res) => {
    console.log("register req", req.body);
    var email = req.body.email;
    var username = req.body.username;
    var mobile_number = req.body.mobile_number;
    var password = req.body.password;
    var name = req.body.name;
    if (!username || !password || !email || !mobile_number || !name ) {
        return res.status(400).send({ 'status': false, 'message': 'missing fields' })
    }
    // User.find({ $or:[
    //     { email: email },
    //     { username: username},
    //     { mobile_number: mobile_number}
    // ] })
    //     .exec()
    User.find({ email: email }).then((emailDetail) => {
        console.log("emailDetail ", emailDetail)
        if (emailDetail.length >= 1) {
            // userUtil.validateRegistartion(req.body, userDetail, function(message) {
            // console.log("message ",message)
            res.status(400).send({
                message: "email already exists"
            })
            // })
        }
        else {
            User.find({ username: username }).then((usernameDetail) => {
                console.log("usernameDetail ", usernameDetail)
                if (usernameDetail.length >= 1) {
                    res.status(400).send({
                        status: false,
                        message: "username already exists"
                    })
                }
                else {
                    User.find({ mobile_number: mobile_number }).then((mobileDetail) => {
                        console.log("mobileDetail ", mobileDetail)
                        if (mobileDetail.length >= 1) {
                            res.status(400).send({
                                status: false,
                                message: "mobile number already exists"
                            })
                        }
                        else {
                            var emailToValidate = req.body.email;
                            const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                            console.log(emailRegexp.test(emailToValidate));
                            if (emailRegexp.test(emailToValidate) == false) {
                                return res.status(500).send({
                                    status: false,
                                    error: "Invalid mailId",
                                });
                            }
                            bcrypt.hash(req.body.password, 10, (err, hash) => {
                                if (err) {
                                    return res.status(500).send({
                                        status: false,
                                        error: err,
                                    });
                                } else {
                                    const user = new User({
                                        email: req.body.email,
                                        password: hash,
                                        name: req.body.name,
                                        username: req.body.username,
                                        mobile_number: req.body.mobile_number
                                    });
                                    user
                                        .save()
                                        .then(async (result) => {
                                            await result
                                                .save()
                                                .then((result1) => {
                                                    console.log(`User created ${result}`)
                                                    res.status(201).send({
                                                        status: true,
                                                        userDetails: {
                                                            userId: result._id,
                                                            email: result.email,
                                                            name: result.name,
                                                            username: result.username,
                                                            mobile_number: result.mobile_number
                                                        },
                                                    })
                                                })
                                                .catch((err) => {
                                                    console.log(err)
                                                    res.status(400).send({
                                                        status: false,
                                                        message: err.toString()
                                                    })
                                                });
                                        })
                                        .catch((err) => {
                                            console.log(err)
                                            res.status(500).send({
                                                status: false,
                                                message: err.toString()
                                            })
                                        });
                                }
                            });
                        }
                    });
                }
            });
        } 
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send({
            status: false,
            message: err.toString()
        })
    });
});

router.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({ 'status': false, 'message': 'Password or Username is invalid' })
    }
    User.findOne({ username: req.body.username }).then((userRes) => {
            console.log("user login res",userRes)
            if (!userRes) {
                return res.status(401).send({
                    status: false,
                    message: "Auth failed: username not found probably",
                });
            }
            bcrypt.compare(req.body.password, userRes.password, (err, result) => {
                console.log("result ",result, err)
                if (err) {
                    console.log("error ",err)
                    return res.status(401).send({
                        status: false,
                        message: "Auth failed",
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            userId: userRes._id,
                            email: userRes.email,
                            username: userRes.username,
                            mobile_number: userRes.mobile_number,
                        },
                        CONSTANT.SECRET_KEY,
                        {
                            expiresIn: "24h",
                        }
                    );
                    console.log("user Result ",userRes)
                    return res.status(200).send({
                        status: true,
                        message: "Auth successful",
                        userDetails: {
                            userId: userRes._id,
                            username: userRes.username,
                            name: userRes.name,
                            email: userRes.email,
                            phone_number: userRes.phone_number,
                        },
                        token: token,
                    });
                }
                res.status(401).send({
                    status: false,
                    message: "Auth failed1",
                });
            });
        })
        .catch((err) => {
            res.status(500).send({
                status: false,
                error: err,
            });
        });
});


module.exports = router