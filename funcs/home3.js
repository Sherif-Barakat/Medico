var express = require('express');
var router = express.Router();
var db = require('../controllers/db');
var bodyPaser = require('body-parser');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

router.get('*', function(req, res, next){
	if(req.cookies['username'] == null){
		res.redirect('/login');
	}else if(req.cookies['username'] == "pharmacist"){
		next();
	}
    else{
        res.send("Please login as pharmacist to access this page")
    }
});
router.get('/',function(req,res){
    res.render('home3.ejs',{user : req.cookies['username']})
})

router.get('/profile3',function(req,res){
    var username = req.cookies['username'];
    db.getuserdetails(username,function(err,result){
        //console.log(result);
        res.render('profile3.ejs',{list:result});
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


router.post('/profile3',function(req,res){
    var username = req.cookies['username'];
    db.getuserdetails(username,function(err,result){
        var id = result[0].id;
        var password = result[0].password;
        var username = result[0].username; 
        if (bcrypt.compareSync(req.body.new_password,password)){
            hashIt(req.body.new_password)
            db.edit_profile(id,req.body.username,req.body.email,pwDB,saltDB,function(err,result1){
                if (result1){
                    res.redirect('/home3/profile3');
                }
                if(!result1){ res.send("old password did not match");}   
            });
        }
    }) ;
});

module.exports =router;