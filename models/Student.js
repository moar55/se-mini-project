var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/portfolio');

console.log('woooah');

var studentSchema = mongoose.Schema({
  id: String,
  username: String,
  password: String,
  department: String,
  profile_picture: String,
  works: []
});

// studentSchema.index({id:1,username:1});

module.exports = mongoose.model('Student', studentSchema);
