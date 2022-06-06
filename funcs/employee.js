var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../controllers/db');
const { check,validationResult } = require('express-validator');

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
    db.getAllemployee(function(err,result){
        res.render('employee.ejs',{employee:result})
    })
});

router.get('/add',function(req,res){
    res.render('add_employee.ejs')
});

router.post('/add',function(req,res){
    var name = req.body.name;
    var email=req.body.email;
    var contact = req.body.contact;
    var date=req.body.date;
    var role=req.body.role;
    var salary=req.body.salary;
    db.add_employee(name,email,contact,date,role,salary,function(err,result){
        console.log('Employee added')
        res.redirect('/employee');
    });
});

router.get('/leave',function(req,res){
    db.getAllLeave(function(err,result){
        res.render('leave.ejs',{user:result})
    });
});

router.get('/add_leave',function(req,res){
    res.render('add_leave.ejs');
});

router.get('/edit_leave/:id',function(req,res){
    var id=req.params.id;
    db.getleavebyid(id,function(err,result){
        res.render('edit_leave.ejs',{user:result})
    });
});

router.post('/edit_leave/:id',function(req,res){
    var id = req.params.id;
    db.edit_leave(id,req.body.name,req.body.leave_type,req.body.from,req.body.to,req.body.reason,function(err,result){
        res.redirect('/employee/leave');
    });
});

router.get('/delete_leave/:id',function(req,res){
    var id=req.params.id;
    db.getleavebyid(id,function(err,result){
        res.render('delete_leave.ejs',{user:result})
    });
});

router.post('/delete_leave/:id',function(req,res){
    var id=req.params.id;
    db.deleteleave(id,function(err,result){
        res.redirect('/employee/leave');
    });
});

router.get('/edit_employee/:id',function(req,res){
    var id=req.params.id;
    db.getEmpbyId(id,function(err,result){
        res.render('edit_employee.ejs',{list:result})
    })
})

router.post('/edit_employee/:id',function(req,res){
    var id=req.params.id;
    var name = req.body.name;
    var email=req.body.email;
    var contact = req.body.contact;
    var date=req.body.date;
    var role=req.body.role;
    db.editEmp(id,name,email,contact,date,role,function(err,result){
        console.log('Employee edited')
        res.redirect('/employee');
    });
});

router.get('/delete_employee/:id',function(req,res){
    var id=req.params.id;
    console.log(id)
    db.getEmpbyId(id,function(err,result){
        console.log(result)
        res.render('delete_employee.ejs',{list:result})
    })
})

router.post('/delete_employee/:id',function(req,res){
    var id=req.params.id;
    db.deleteEmp(id,function(err,result){
        res.redirect('/employee');
    });
});

router.post('/search', function (req, res) {
    var key = req.body.search;
    db.searchEmp(key, function (err, result) {
        res.render('employee.ejs', {employee: result});
    })
});

router.post('/add_leave',[
    check('name').notEmpty(),
    check('id').notEmpty(),
    check('leave_type').notEmpty(),
    check('from').notEmpty().withMessage("Please select a date"),
    check('to').notEmpty().withMessage("Please select a date"),
    check('reason').notEmpty().withMessage("Please specify leave reason"),
    ],function(req,res){
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({erros:errors.array()});
        }
        var name = req.body.name;
        var email=req.body.email;
        var contact = req.body.contact;
        var date=req.body.date;
        var role=req.body.role;
        var salary=req.body.salary;
        db.add_leave(name,email,contact,date,role,salary,function(err,result){
            res.redirect('/employee/leave');
        })
})

module.exports=router;