var express = require ('express');
var router = express.Router();
var db = require('../controllers/db');
var bodyPaser = require ('body-parser');


router.get('/',function(req,res){
    db.getallappointment(function(err,result){
        db.getAllDoc(function(err,result2){
            res.render('appoint.ejs',{list :result,doc:result2});
        });      
    })    
});
router.post('/',function(req,res){

    db.add_appointment(req.body.p_name,req.body.department,req.body.doctor_name,req.body.date,req.body.time,req.body.email,req.body.phone,function(err,result){
        res.redirect('/');
    });

});

module.exports =router;