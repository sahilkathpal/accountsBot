var User = require('../models/User')

function register (username, slackName) {
  User.findOne({'slack_name': slackName}, function (err, user) {
    // In case of any error return
      if (err){
        console.log('Error in SignUp: '+err)
        return false
      }
      // already exists
      if (user) {
        user.name = username
        user.save(function(err) {
          if (err) {
            console.log('Error in Saving user: '+err)
            throw err
          }
          return true
      }
      //new user
      var newUser = new User({
        'name': username,
        'slack_name': slackName
      })
      newUser.save(function () {
        if (err) {
          console.log('Error in Saving user: '+err)
          throw err
        }
        return true
      })
  })
}
module.exports = {
  register: register
}
