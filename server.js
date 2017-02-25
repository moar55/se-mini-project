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
app.use(multer({dest: 'uploads/'}).single('file'));
app.use('/students',express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "Secret key boy, what a secret man"}));


app.use('/students',students);
app.listen(3000);
