var User = require('../models/User')
var Expense = require('../models/Expense')

function register (username, slackName) {
  console.log('username is '+username)
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
          }
          return true
        })
      }
      //new user
      if(! user) {
        var newUser = new User({
          'name': username,
          'slack_name': slackName
        })
        newUser.save(function () {
          if (err) {
            console.log('Error in Saving user: '+err)
          }
          return true
        })

      }
  })
}

function expenseRecord (slackName, message) {
  var promise = new Promise (function (resolve, reject) {
    User.findOne({'slack_name': slackName}, function (err, user) {
      if (! user) return reject( "Please register.")
      var messageArray = message.split(' on ')
      var expense = new Expense()
      expense.user = user.name
      expense.date = Date.now()
      expense.description = messageArray[1]
      var amountArray =  messageArray[0].split(' ')
      expense.amount = amountArray[amountArray.length - 1]
      console.log(expense);
      console.log(messageArray[0].split(' '));

      expense.save(function (err) {
        if (err) console.log(err)
        resolve ("Got it. Thanks.")
      })
    })

  })
  return promise
}

module.exports = {
  register: register,
  expenseRecord: expenseRecord
}
