# se-mini-project
This is a mini project(warmup) for the SE course in the German University in Cairo.
It is a portfolio site to allow BI(Business Infomatics) and CS students to create a portfolio and post their works.

## Please update to node v6+
I am using the nodemailer module for password recovery which only works with node v6+
.However if you can't possibly update you can refer to the older commit "major bug fix".

### Files/Folders you will need to create:
- uploads folder for temp upload (it should be created automatically by node according to my code).
- students_photos folder, used for actual storage of students photos.
- config.js file for the email credentials of the email that will send recovery links.
 this file should look something similar to this:
 
 ```javascript
 module.exports = {
  nodemailer: {
    service: '<email_domain>',
    auth:{
      user:'<email>',
      password:'<pass>'
    }
  }
}
  ```
**Note**: If you are using gmail as the email for sending recovery emails make sure you enable secure less apps on your gmail's account.
