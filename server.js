var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var students = require('./routes/students');
var logger = require('morgan');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

// TODO: Add HTML headers :)
app.set('view engine', 'pug');
app.set('views','./views');
// app.use(logger('short'));
app.use(multer({dest: 'uploads/'}).array('files'));
app.use('/static',express.static(__dirname+'/public'));
app.use('/static',express.static(__dirname+'/students_photos'))
app.use(express.static('students_photos'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "Secret key boy, what a secret man"}));

app.get('/',function (req, res) {
  res.redirect('/home')
})

app.get('/home',function (req, res) {
  res.render('home')
})

app.use('/students',students);
app.listen(3000);
