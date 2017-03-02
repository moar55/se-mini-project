var express = require("express");
var router = express.Router();
var Student = require('../models/Student.js');
var passwordHash = require('password-hash');
var path = require('path'),fs=require('fs');
var mongoose = require('mongoose');
var request = require('request');


router.get('/register',function (req, res) {
  if(!req.session.student)
  res.render('student_register');
  else {
    res.redirect('/students/'+req.session.student.id)
  }
})


router.post('/register',function (req, res) {
  if(!req.body.id || !req.body.username || !req.body.password
   || !passwordVerify(req.body.password) || !idVerify(req.body.id)){ // Password and ID verification
     res.render('student_register',{message: "Fill the required fields and enter a valid id and a valid password of atleast 8 characters contining  one special character and one digit.",
                type:"error"}  )
   }

   else{
    Student.findOne({$or: [{'id': req.body.id} ,{'username': req.body.username}]},function (err, student) {
      if(err)res.render('student_register',{message: "An error occured, try again.",type:"error"})
      else if(student)
        res.render('student_register',{message: "id or username already taken",type: "error"})
     else{
       var newStudent = new Student({
         id: req.body.id,
         username: req.body.username,
         password: passwordHash.generate(req.body.password),
         department: req.body.department
       });
       newStudent.save(function (err, response) {
         if(err)
         res.render('student_register',{message: "Database error: "+err,type:"error"})
         else {
           req.session.student = newStudent;
           res.redirect('/students/'+req.body.id)
         }

       })
     }
   })
}
})


router.post('/login',function (req, res) {
  if(!req.body.username || !req.body.password)
     res.render('student_login',{message: "Fill all the fields please", type:"error"})
   else {
     Student.findOne({'username': req.body.username},function (err, student) {
       if(err){
        res.render('student_login',{message: "An error occured, try again.",type:"error"})
      }
       else if(student){
        if(passwordHash.verify(req.body.password,student.password)){
         req.session.student = student;
         console.log(req.session.student);
         res.redirect('/students/'+student.id)
       }
       else{
         res.render('student_login',{message: "Wrong password", type:"error"})
       }
     }
       else{
         res.render('student_login',{message: "Wrong username", type:"error"})
       }
     });
   }
})

router.get('/login',function (req, res) {
  if(!req.session.student)
  res.render('student_login');
  else {
    res.redirect('/students/'+req.session.student.id)
  }
})

router.get('/logout',function (req, res) {
  req.session.destroy();
  res.redirect('../home');
})

router.get('/:id',function (req, res) {
  console.log("hey man "+__dirname);
  var student = Student.findOne({id: req.params.id},function (err, student) {
    if(student){
    res.render('student_portfolio',{student:student,session:req.session.student});
  }
    else {
      res.status(404);
      res.render('404') // TODO: make a specific error message ?
    }
  })
})

router.get('/:id/create-portfolio',function (req, res) {
  console.log(req.session.student);
  if(req.session.student && req.session.student.id == req.params.id)
    res.render('student_create_portfolio',{student:req.session.student, session: req.session.student});
  else{
    res.status(401);
    res.render('401');
  }
})

router.post('/:id/create-portfolio',function (req, res){ // TODO: Ensure that the right user is the one posting...
  if(req.body.name){
    if(req.files){

    var uploadPath = req.files[0].path;  // TODO: Check for valid extension
    var savePath = path.resolve('students_photos/'+req.params.id+'_portfolio.png');
    var workUploadPath = req.files[1].path;  // TODO: Check for valid extension
    var id = mongoose.Types.ObjectId();
    var workSavePath = path.resolve('students_photos/'+id+'_work.png');

    if(fs.rename(uploadPath, savePath, savePortfolioProfilePicture.bind(null,req,req.params.id+'_portfolio.png')))return res.status(500).send();
    // fs.unlinkSync(uploadPath);
    if(fs.rename(workUploadPath, workSavePath,saveWorkPhoto.bind(null,req,id,id+"_work.png")))return res.status(500).send();;
    // fs.unlinkSync(workUploadPath);
    }
    console.log('awesoome');

    res.redirect('/students/'+req.params.id);
  }
  else{
    res.redirect('students/'+req.params.id+'/create-portfolio')
  }
})

router.post('/:id/create-work',function (req, res){ // TODO: Ensure that the right user is the one posting...
  if(req.body.name || req.files){
    var workUploadPath = req.files[0].path;  // TODO: Check for valid extension
    var id = mongoose.Types.ObjectId();
    var workSavePath = path.resolve('students_photos/'+id+'_work.png');
    if(fs.rename(workUploadPath, workSavePath,saveWorkPhoto.bind(null,req,id,id+"_work.png")))return res.status(500).send();;
    // fs.unlinkSync(workUploadPath);
    }
    res.redirect('/students/'+req.params.id);
})

function savePortfolioProfilePicture(req,savePath,err) {
  if(err){
    console.log('w00t,error '+err);
    return 1;   // Error Occured
  }
  else{
    console.log('w00t');
    Student.findOne({'id': req.params.id}, function (err, student) {
      console.log(student);
      student.profile_picture = savePath;
      student.save(function (err, savedStudent) {
        if(err) return 1; // Error Occured
        else req.session.student = savedStudent;  // Update student's info
      });

    });
  }
}

function saveWorkPhoto(req,id,savePath,err) {
  console.log('ehmm');
  if(err){
    console.log('w00t,error '+err);
    return 1;
  }
  else{
    console.log('w00t');
    Student.findOne({'id': req.params.id}, function (err, student) {
      var work = {id: id, name: req.body.work_name, link: req.body.link, repository: req.body.repo_url, pic: savePath};
      student.works.push(work)
      student.save(function (err, savedStudent) {
        if(err) return 1;
        else req.session.student = savedStudent; // Update student's info
      });
    });
  }
}


function passwordVerify(password) {
  return (password.match(/[!"#$%&'()*+,-./:;<=>?@\[\]\\^_`{|}~]/) &&
         password.length>=8 && password.match(/[0-9]/));
}

function idVerify(id) {
  return id.match(/[0-9]+-[0-9]+/);
}

module.exports = router
