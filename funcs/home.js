var express = require('express');
var router = express.Router();
var db = require('../controllers/db');
var bodyPaser = require('body-parser');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

router.get('*', function (req, res, next) {
    if (req.cookies['username'] == null) {
        res.redirect('/login');
    } else if (req.cookies['username'] == "admin") {
        next();
    }
    else {
        res.send("Please login as admin to access this page")
    }
});

router.get('/', function (req, res) {
    db.getAllDoc(function (err, result) {
        db.getallappointment(function (err, result1) {
            db.getAllpatient(function (err, result2) {
                var total_doc = result.length;
                var appointment = result1.length;

                res.render('home.ejs', { doc: total_doc, doclist: result, appointment: appointment, applist: result1, patients: result2 });
            })
        });
        //console.log(result.length);

    });

});

router.get('/departments', function (req, res) {

    db.getAlldept(function (err, result) {

        res.render('departments.ejs', { list: result });

    });

});

router.get('/add_departments', function (req, res) {
    res.render('add_departments.ejs');
});

router.post('/add_departments', function (req, res) {
    var name = req.body.dpt_name;
    var desc = req.body.desc;
    db.add_dept(name, desc, function (err, result) {
        res.redirect('/home/departments');
    });
});

router.get('/delete_department/:id', function (req, res) {

    var id = req.params.id;
    db.getdeptbyId(id, function (err, result) {
        res.render('delete_department.ejs', { list: result });
    });
});

router.post('/delete_department/:id', function (req, res) {
    var id = req.params.id;
    db.delete_department(id, function (err, result) {
        res.redirect('/home/departments');
    });
});

router.get('/edit_department/:id', function (req, res) {
    var id = req.params.id;
    db.getdeptbyId(id, function (err, result) {
        res.render('edit_department.ejs', { list: result });
    })
});


router.post('/edit_department/:id', function (req, res) {

    db.edit_dept(req.params.id, req.body.dpt_name, req.body.desc, function (err, result) {
        res.redirect('/home/departments');
    });
});

router.get('/profile', function (req, res) {
    var username = req.cookies['username'];
    db.getuserdetails(username, function (err, result) {
        //console.log(result);
        res.render('profile.ejs', { list: result });
    });
});

var pwDB;
var saltDB;

function hashIt(password) {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);
    pwDB = hashed;
    saltDB = salt;
};

router.post('/profile', function (req, res) {
    var username = req.cookies['username'];
    db.getuserdetails(username, function (err, result) {
        var id = result[0].id;
        var password = result[0].password;
        var username = result[0].username;
        if (bcrypt.compareSync(req.body.password, password)) {
            hashIt(req.body.new_password);
            db.edit_profile(id, req.body.username, req.body.email, pwDB, saltDB, function (err, result1) {
                if (result1) {
                    res.redirect('/home');
                }
                if (!result1) { res.send("old password did not match"); }
            });


        }
        else {
            res.send("Wrong password entered!")
        }
    });
});

module.exports = router;