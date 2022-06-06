var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../controllers/db');
var mysql = require('mysql');
var session = require('express-session');
var sweetalert = require('sweetalert2');
const { check, validationResult } = require('express-validator');
const e = require('express');
var crypto = require('crypto');
var bcrypt = require('bcrypt');


var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hms'
});

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.render('login.ejs');
});

router.post('/', [check('username').notEmpty().withMessage("Username is required"),
check('password').notEmpty().withMessage("Password is required")],
    function (request, response) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() })
        }
        var username = request.body.username
        var password = request.body.password;
        if (username && password ) {
            con.query('SELECT * FROM users where username = ? ', [username],
                function (error, results, fields) {
                    if (results.length > 0 && bcrypt.compareSync(password, results[0].password)) {
                        request.session.loggedIn = true;
                        request.session.username = username;
                        response.cookie('username', username);
                        var status = results[0].email_status;
                        if (status == "not_verified") {
                            //response.send("Logged in")
                            response.send("Please verify your email");
                        } else {
                            sweetalert.fire('logged In!');
                            if (username == "doctor") {
                                response.redirect('/home2');
                            }
                            else if (username == "pharmacist") {
                                response.redirect('/home3');
                            }
                            else {
                                response.redirect('/home')
                            }

                            //response.redirect('/home');
                        }
                    } else {
                        response.send("Incorrect username or password");
                    }
                    response.end();
                })
        } else {
            response.send("Please enter username and password");
            response.end();
        }
    })

module.exports = router;