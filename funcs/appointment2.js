var express = require ('express');
var router = express.Router();
var db = require('../controllers/db');
var bodyPaser = require ('body-parser');

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
    db.getallappointment(function(err,result){
        db.getAllDoc(function(err,result2){
            res.render('appointment2.ejs',{list :result,doc:result2});
        });      
    })    
});

router.get('/add_appointment',function(req,res){
    db.getAllDoc(function(err,result2){
        res.render('add_appointment2.ejs',{doc:result2});
    });      
});


router.post('/add_appointment2',function(req,res){

    db.add_appointment(req.body.p_name,req.body.department,req.body.doctor_name,req.body.date,req.body.time,req.body.email,req.body.phone,function(err,result){
        res.redirect('/appointment2');
    });

});


router.get('/edit_appointment2/:id',function(req,res){
    var id = req.params.id;
    db.getappointmentbyid(id,function(err,result){
        res.render('edit_appointment2.ejs',{list : result});
    });

});

router.post('/edit_appointment2/:id',function(req,res){
    var id = req.params.id;
    db.editappointment(id,req.body.p_name,req.body.department,req.body.d_name,req.body.date,req.body.time,req.body.email,req.body.phone,function(err,result){
        res.redirect('/appointment2');
    });
});


router.get('/delete_appointment2/:id',function(req,res){
    var id = req.params.id;
    db.getappointmentbyid(id,function(err,result){
        res.render('delete_appointment2.ejs',{list:result});
    })
    
});

router.post('/delete_appointment2/:id',function(req,res){
    var id =req.params.id;
    db.deleteappointment(id,function(err,result){
        res.redirect('/appointment2');
    });
})

module.exports =router;