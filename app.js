var express = require('express');
var session = require('express-session');
var cookie = require('cookie-parser');
var path = require('path');
var ejs = require('ejs');
var multer = require('multer');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var expressValidator = require('express-validator');
var sweetalert = require('sweetalert2');
var bodyParser = require('body-parser');
const http = require('http');
var db = require('./controllers/db');
var signup = require('./funcs/signup');
var login = require('./funcs/login');
var verify = require('./funcs/verify');
var reset = require('./funcs/reset');
var doctor = require('./funcs/doctor');
var employee = require('./funcs/employee');
var logout = require('./funcs/logout');
var store = require('./funcs/store');
var landing = require('./funcs/landing');
var complain = require('./funcs/complain');
var inbox = require('./funcs/inbox');
var appointment = require('./funcs/appointment');
var appointment2 = require('./funcs/appointment2');
var home = require('./funcs/home');
var receipt = require('./funcs/receipt');
var set = require('./funcs/set');
var chat = require('./funcs/chat');
var patient = require('./funcs/patient');
var appoint = require('./funcs/appoint');
var home2 = require('./funcs/home2');
var home3 = require('./funcs/home3');
var store3 = require('./funcs/store3');
var patient2 = require('./funcs/patient2');
var covidAPI=require('./covid');
var router=express.Router();

var app = express();
app.set('view engine', 'ejs');
const server = http.createServer(app);
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookie());

const asyncApiCall = async () => {
    const response = await covidAPI.getReport('2020-08-09')
    const response2= await covidAPI.getWorldReport('2020-08-09')
    console.log(response.data)
    console.log(response2.data)
}
asyncApiCall();

const PORT = process.env.PORT || 4000
server.listen(PORT, () => console.log('server running on port 4000'));

app.use('/login', login);
app.use('/home', home);
app.use('/signup', signup);
app.use('/doctor', doctor);
app.use('/reset', reset);
app.use('/setpassword', set);
app.use('/employee', employee);
app.use('/logout', logout);
app.use('/verify', verify);
app.use('/store', store);
app.use('/', landing);
app.use('/complain', complain);
app.use('/inbox', inbox);
app.use('/appointment', appointment);
app.use('/receipt', receipt);
app.use('/patients', patient);
app.use('/patients2', patient2);
app.use('/appoint', appoint);
app.use('/home2', home2);
app.use('/home3', home3);
app.use('/store3',store3);
app.use('/appointment2', appointment2);
