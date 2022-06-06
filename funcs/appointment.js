var express = require ('express');
var router = express.Router();
var db = require('../controllers/db');
var bodyPaser = require ('body-parser');

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

router.get('/',function(req,res){
    db.getallappointment(function(err,result){
        db.getAllDoc(function(err,result2){
            res.render('appointment.ejs',{list :result,doc:result2});
        });      
    })    
});

router.get('/add_appointment',function(req,res){
    db.getAllDoc(function(err,result2){
        res.render('add_appointment.ejs',{doc:result2});
    });      
});

router.post('/add_appointment',function(req,res){

    db.add_appointment(req.body.p_name,req.body.department,req.body.doctor_name,req.body.date,req.body.time,req.body.email,req.body.phone,function(err,result){
        res.redirect('/appointment');
    });

});


router.get('/edit_appointment/:id',function(req,res){
    var id = req.params.id;
    db.getappointmentbyid(id,function(err,result){
        res.render('edit_appointment.ejs',{list : result});
    });

});

router.post('/edit_appointment/:id',function(req,res){
    var id = req.params.id;
    db.editappointment(id,req.body.p_name,req.body.department,req.body.d_name,req.body.date,req.body.time,req.body.email,req.body.phone,function(err,result){
        res.redirect('/appointment');
    });
});


router.get('/delete_appointment/:id',function(req,res){
    var id = req.params.id;
    db.getappointmentbyid(id,function(err,result){
        res.render('delete_appointment.ejs',{list:result});
    })
    
});

router.post('/delete_appointment/:id',function(req,res){
    var id =req.params.id;
    db.deleteappointment(id,function(err,result){
        res.redirect('/appointment');
    });
})









module.exports =router;