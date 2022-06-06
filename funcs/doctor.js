var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../controllers/db');
var multer = require('multer');
var fs = require('fs');
var path = require('path');

router.get('*', function(req, res, next){
	if(req.cookies['username'] == null){
		res.redirect('/login');
	}else if(req.cookies['username'] == "admin"){
		next();
	}
    else{
        res.send("Please login as admin to access this page")
    }
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets/images/upload_images");
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

router.get('/', function (req, res) {
    db.getAllDoc(function (err, result) {
        res.render('doctors.ejs', { list: result });
    });
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/add_doctor', function (req, res) {
    db.getAlldept(function(err,result){
        res.render('add_doctor.ejs',{list:result});
    });
});

router.post('/add_doctor', upload.single("image"), function (req, res) {
    db.add_doctor(req.body.first_name, req.body.last_name, req.body.email,
        req.body.dob, req.body.gender, req.body.address,
        req.body.phone, req.file.filename, req.body.departments,
        req.body.biography)
    if (db.add_doctor) {
        console.log('1 doc inserted');
    }
    db.getAllDoc(function (err, result) {
        res.render('doctors.ejs', { list: result });
    });
});

router.get('/edit_doctor/:id', function (req, res) {
    var id = req.params.id;
    db.getDocbyId(id, function (err, result) {
        res.render('edit_doctor.ejs', { list: result });
    });
});

router.post('/edit_doctor/:id', function (req,res) {
    var id = req.params.id;
    db.edit_doctor(id, req.body.first_name, req.body.last_name, req.body.email,
        req.body.dob, req.body.gender, req.body.address,
        req.body.phone, req.body.department,
        function (err, result) {
            if (err) {
                throw err;
            }
            db.getAllDoc(function (err, result) {
                res.render('doctors.ejs', { list: result });
            });
        });
});

router.get('/delete_doctor/:id', function (req, res) {
    var id = req.params.id;
    db.getDocbyId(id, function (err, result) {
        res.render('delete_doctor.ejs', { list: result });
    });
});

router.post('/delete_doctor/:id', function (req, res) {
    var id = req.params.id;
    db.deleteDoc(id, function (err, result) {
        db.getAllDoc(function (err, result) {
            res.render('doctors.ejs', { list: result });
        });
    });
});


router.get('/', function (req, res) {
    db.getAllDoc(function (err, result) {
        if (err) {
            throw err;
        }
        res.render('doctors.ejs', { list: result });
    });
});

router.post('/search', function (req, res) {
    var key = req.body.search;
    db.searchDoc(key, function (err, result) {
        console.log(result);
        res.render('doctors.ejs', { list: result });
    });
});

module.exports = router;