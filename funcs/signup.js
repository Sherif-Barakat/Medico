var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../controllers/db');
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var randomToken = require('random-token');
const { check, validationResult } = require('express-validator');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hms'
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.render('signup.ejs');
});

var saltDB;
var pwDB;

function hashIt(password) {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);
    pwDB = hashed;
    saltDB = salt;
};


router.post('/', [check('username').notEmpty().withMessage("username is required"),
check('password').notEmpty().withMessage("password is required"),
check('email').notEmpty().withMessage("email is required")], function (req, res) {

    const errors = validationResult(req);
    if (!(errors.isEmpty())) {
        return res.status(442).json({ errors: errors.array() })
    }
    var status = "not_verified";
    var email = req.body.email;
    var username = req.body.username;
    var password=req.body.password
    con.query('SELECT email FROM users WHERE email = "' + email + '"',
        function (err, result1) {
            if (result1[0] == undefined) {
                hashIt(password);
                var query = "INSERT INTO `users`(`username`,`email`,`password`,`email_status`,`salt`) VALUES('" + username + "','" + email + "','" + pwDB + "','" + status + "','" + saltDB +"')";
                con.query(query);
                var token = randomToken(8);
                db.verify(username, email, token)
                db.getuserid(email, function (err, result) {
                    var id = result[0].id;
                    var output = `<p>Dear ${username},</p>
                        <p>Thanks for signing up. Your verification id and token are given below:</p>
                        <ul>
                        <li>User ID: ${id}</li>
                        <lis>Token: ${token}</li>
                        </ul>
                        <p>Verify link: <a href="http://localhost:4000/verify">Verify</a> </p>
                        <p><b>Please don't reply to this automatically generated mail.</b></p>
                        `;
                    var emailer = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: "465",
                        secure: true,
                        auth: {
                            user: "tacc0612@gmail.com",
                            pass: "anasherif22"
                        }
                    });
                    var mailOptions = {
                        from: 'HMS@gmail.com',
                        to: email,
                        subject: 'Email Verification',
                        html: output
                    };

                    emailer.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                    res.send("Check your email address for verification!");
                })

            } else {
                res.send('Email already in use,try signing up with a different email.');
            }
        });
});
module.exports = router;          
