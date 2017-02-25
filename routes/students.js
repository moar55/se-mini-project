var express = require("express");
var router = express.Router();
var Student = require('../models/Student.js');
var passwordHash = require('password-hash');

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
      console.log(student);
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
           res.redirect('login');
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
       if(err)res.render('student_login',{message: "An error occured, try again.",type:"error"})
       else if(student){
        if(passwordHash.verify(req.body.password,student.password)){
         req.session.student = student; // TODO: Check if this actually works :D
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
  res.redirect('/students/login');
})


router.get('/:id',function (req, res) {
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



function passwordVerify(password) {
  return (password.match(/[!"#$%&'()*+,-./:;<=>?@\[\]\\^_`{|}~]/) &&
         password.length>=8 && password.match(/[0-9]/));
}

function idVerify(id) {
  return id.match(/[0-9]+-[0-9]+/); // TODO: Check that the id follows the sequence {1,3,7,...}
}

module.exports = router
