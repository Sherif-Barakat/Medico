var express = require('express');
var flash = require('flash');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var randomToken = require('random-token');
var db = require('../controllers/db');


router.get('/', function (req, res) {
    res.render('resetpassword.ejs')
})

router.post('/', function (req, res) {
    var email = req.body.email;
    db.findOne(email, function (err, resultOne) {
        if (resultOne[0]==null) {
            console.log("Mail does not exist");
            res.redirect('back');
        } else {
            var id = resultOne[0].id;
            var email = resultOne[0].email;
            var token = randomToken(8);
            db.temp(id, email, token, function (err, resulttwo) {
                var output = `<p>Dear user, </p>
            <p>This email was sent as per a request to reset your password</p>
            <ul>
            <li>User ID : `+ id + `</li>
            <li>Token : `+ token + `<li>
            </ul>
            `
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "tacc0612@gmail.com",
                        pass: "anasherif22"
                    }
                });

                var mailOptions = {
                    from: 'HMS IT',
                    to: email,
                    subject: 'Password reset',
                    html: output
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        return console.log(err)
                    } else {

                    }
                })
            })
            res.send("Token sent to your email address");
        }
    })
})
module.exports = router;