var express = require("express");
var router = express.Router();
var Student = require('../models/Student.js');

router.get('/register',function (req, res) {
  res.render('student_register');
})

router.post('/register',function (req, res) {

  if(!req.body.id || !req.body.username || !req.body.password
   || !passwordVerify(req.body.password)){ // Password verification
     res.render('student_register',{message: "Fill the required fields and enter a valid password of atleast 8 characters contining  one special character and one digit.",
                type:"error"}  )
   }
   else{
     console.log(Student.find()
     );
     if(Student.find({id: req.body.id, username: req.body.username}))
     res.render('student_register',{message: "id or username already taken",type:"error"})
     else{
       var newStudent = new Student({
         id: req.body.id,
         username: req.body.username,
         password: req.body.password,
         department: req.body.department
       });
       newStudent.save(function (err, res) {
         if(err)
         res.render('student_register',{message: "Database error: "+err,type:"error"})
         else {
           res.redirect('login');
         }

       })
     }
   }
})


router.get('/login',function (req, res) {
  res.render('studnet_login');

})

function passwordVerify(password) {
  return password.match(/[!"#$%&'()*+,-./:;<=>?@\[\]\\^_`{|}~]/ &&
         password.length>=8 && password.match(/[0-9]/));
}

module.exports = router
