var mongoose = require('mongoose');

var resetToken = mongoose.Schema({
  id: String,
  email: String,
  createdAt:{
          type: Date,
          default: new Date()
  }
});

resetToken.index({createdAt: 1},{expireAfterSeconds: 3600})

// studentSchema.index({id:1,username:1});

module.exports = mongoose.model('Reset_Token', resetToken);
// module.exports = mongoose;
