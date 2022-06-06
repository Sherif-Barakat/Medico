var express = require('express');

var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../controllers/db');
var crypto = require('crypto');
var bcrypt = require('bcrypt');



router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());


module.exports =router;

router.get('/',function(req,res){

    res.render('setpassword.ejs');
});

var saltDB;
var pwDB;

function hashIt(password) {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);
    pwDB = hashed;
    saltDB = salt;
};


router.post('/',function(req,res){

    var token = req.body.token;
    db.checktoken(token,function(err,result){
        
        if (result.length > 0 ){
            var newpassword = req.body.password;
            hashIt(newpassword);
            var id =result[0].id;
            db.setpassword(id,pwDB,saltDB,function set(err,result1){
                if(err){
                   // console.log('token did not match');
                    res.send('token did not match');
                }
                else{
                    res.redirect('/login');
                }
                
            });
           
        }
        else {
            res.send('Token didnt match!!!');
        }
           
        
    });
});