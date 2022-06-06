var express = require('express');
var router = express.Router();
var db = require('../controllers/db');
var bodyPaser = require('body-parser');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

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
    db.getAllDoc(function(err,result){
        db.getallappointment(function(err,result1){
            db.getAllpatient(function(err,result2){
                var total_doc = result.length ;
                var appointment = result1.length;
                res.render('home2.ejs',{doc : total_doc , doclist : result, appointment : appointment, applist : result1, patient:result2,user : req.cookies['username']});
                });        
            })
    });
   
});

router.get('/profile2',function(req,res){
    var username = req.cookies['username'];
    db.getuserdetails(username,function(err,result){
        //console.log(result);
        res.render('profile2.ejs',{list:result});
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


router.post('/profile',function(req,res){
    var username = req.cookies['username'];
    db.getuserdetails(username,function(err,result){
        var id = result[0].id;
        var password = result[0].password;
        var username = result[0].username; 
        if (bcrypt.compareSync(req.body.new_password,password)){
            hashIt(req.body.new_password)
            db.edit_profile(id,req.body.username,req.body.email,pwDB,saltDB,function(err,result1){
                if (result1){
                    res.redirect('/home2/profile2');
                }
                if(!result1){ res.send("old password did not match");}   
            });
        }
    }) ;
});

module.exports =router;