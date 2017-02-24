var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/portfolio');

var studentSchema = mongoose.Schema({
  id: String,
  username: String,
  password: String,
  department: String
});

module.exports = mongoose.model('Student', studentSchema);
