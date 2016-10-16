var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
  name: String,
  slack_name: String
})

module.exports = mongoose.model('User', userSchema)
