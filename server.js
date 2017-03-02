var express = require("express");
var app = express();
var Student = require('./models/Student.js');
var bodyParser = require('body-parser');
var session = require('express-session');
var students = require('./routes/students');
var logger = require('morgan');
var multer = require('multer');
var mongoose = require('mongoose');
const portfoliosPerPage = 10;

// TODO: Add HTML headers :)
// TODO: Fix the fact that i have to refresh for content to be displayed after uploading...etc
// TODO: Add email field to students and forgot your password feature.
app.set('view engine', 'pug');
app.set('views','./views');
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
  Student.find({works: {$not: {$size: 0}}},function (err, students) {
    console.log('wow');
    if(err) res.status(500).send();
    else {
      var pages = Math.ceil(students.length/portfoliosPerPage);
      var students2D =[];
      while(students[0]) {students2D.push(students.splice(0,3))}; // Create a 2D array because pug isn't cool :(
      res.render('summary', {students: students2D,session: req.session.student,pages: pages})
    }
  })
})

app.get('/home&res=:page',function (req, res) {
  Student.find({works: {$not: {$size: 0}}},function (err, students) {
    console.log('wow');
    var page = req.params.page
    if(err) res.status(500).send();
    else {
      var pages = Math.ceil(students.length/portfoliosPerPage);
      students = students.slice((page-1)*portfoliosPerPage,page*portfoliosPerPage);
      var students2D =[];
      while(students[0]) {students2D.push(students.splice(0,3))}; // Create a 2D array because pug isn't cool :(
      res.render('summary', {students: students2D, session: req.session.student,pages: pages})
    }
})
})

app.use('/students',students);
app.listen(3000);