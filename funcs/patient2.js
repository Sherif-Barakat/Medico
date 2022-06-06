var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../controllers/db');
const { check,validationResult } = require('express-validator');

router.get('*', function(req, res, next){
	if(req.cookies['username'] == null){
		res.redirect('/login');
	}else if(req.cookies['username'] == "doctor"){
		next();
	}
    else{
        res.send("Please login as doctor to access this page")
    }
});

router.get('/',function(req,res){
    db.getAllpatient(function(err,result){
        res.render('patients2.ejs',{list:result})
    })
});

router.get('/add2',function(req,res){
    db.getAllDoc(function(err,result2){
        res.render('add_patient2.ejs',{doc:result2});
    });      
});

router.post('/add2',function(req,res){

    db.add_patient(req.body.name,req.body.email,req.body.contact,req.body.age,req.body.doctor,req.body.bloodType,function(err,result){
        console.log('Patient added')
        res.redirect('/patients2');
    });
});

router.get('/edit_patient2/:id', function (req, res) {
    var id = req.params.id;
    db.getPatientbyId(id, function (err, result) {
        res.render('edit_patient2.ejs', { list: result });
    });
});

router.post('/edit_patient2/:id', function (req,res) {
    var id = req.params.id;
    var name = req.body.name;
    var email=req.body.email;
    var contact = req.body.contact;
    var age=req.body.age;
    var doctor=req.body.doctor;
    var bloodType=req.body.bloodType;
    db.edit_patient(id,name,email,contact,age,doctor,bloodType,
        function (err, result) {
            if (err) {
                throw err;
            }
            db.getAllpatient(function (err, result) {
                res.render('patients2.ejs', { list: result });
            });
        });
});

router.get('/delete_patient2/:id', function (req, res) {
    var id = req.params.id;
    db.getPatientbyId(id, function (err, result) {
        res.render('delete_patient2.ejs', { list: result });
    });
});

router.post('/delete_patient2/:id', function (req, res) {
    var id = req.params.id;
    db.deletePatient(id, function (err, result) {
        db.getAllpatient(function (err, result) {
            res.render('patients2.ejs', { list: result });
        });
    });
});


router.get('/', function (req, res) {
    db.getAllpatient(function (err, result) {
        if (err) {
            throw err;
        }
        res.render('patients2.ejs', { list: result });
    });
});

router.post('/search', function (req, res) {
    var key = req.body.search;
    db.searchPatient(key, function (err, result) {
        console.log(result);
        res.render('patients2.ejs', { list: result });
    });
});

module.exports = router;