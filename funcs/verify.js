var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../controllers/db');

const { check, validationResult } = require('express-validator');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/',function(req,res){
    var id=req.body.id;
    var token=req.body.token;
    db.matchtoken(id,token,function(err,result){
        if(result.length>0){
            var email=result[0].email;
            var email_status ="verified";
            db.updateverify(email,email_status,function(err,results){
                //res.send("Email verified successfully!");
                res.redirect('/home')
            })
        }else{
            res.send("Token doesn't match");
        }
    });
})





module.exports=router;
router.get('/',function(req,res){
    res.render('verify.ejs')
})