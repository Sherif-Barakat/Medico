var express = require ('express');
var router = express.Router();
var db = require('../controllers/db');
var bodyPaser = require ('body-parser');
router.get('*', function(req, res, next){
	if(req.cookies['username'] == null){
		res.redirect('/login');
	}else{
		next();
	}
});

router.get('/',function(req,res){
    db.getcomplain(function(err,result){
        res.render('inbox.ejs',{list :result});
    })
});











module.exports =router;

