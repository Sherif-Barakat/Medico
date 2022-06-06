var mysql =require('mysql');
var express = require ('express');
var cookie = require ('cookie-parser');
var db = require('../controllers/db');
var router = express.Router();


router.get('/',function(req,res){
    res.render('landing.ejs');
});

module.exports = router;