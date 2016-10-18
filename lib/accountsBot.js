var util = require('util')
var Bot = require('slackbots')
var userRepo = require('../repositories/UserRepository')
var _ = require('lodash')

var AccountsBot = function Constructor (settings) {
  this.settings = settings
  this.settings.name = settings.name || 'accounts_bot'

  this.user = null
}

util.inherits(AccountsBot, Bot)

AccountsBot.prototype.run = function () {
  AccountsBot.super_.call(this, this.settings)

  this.on('start', this._onStart)
  this.on('message', this._onMessage)
}

AccountsBot.prototype._onStart = function () {
    this._loadBotUser();
}

AccountsBot.prototype._loadBotUser = function () {
  var self = this
  this.user = this.users.filter(function (user) {
    return user.name == self.name
  })[0]
}

AccountsBot.prototype._onMessage = function (message) {
  console.log(message);
  if (! this._isChatMessage(message) || ! this._isChannelConversation(message) || this._isFromAccountsBot(message)) {
    console.log('failed'); return;
  }
  if (this._isRegisterMessage(message)) {
    return this._registerUser(message)
  }

  if (this._isExpenseRecordMessage(message)) {
    return this._expenseRecord(message)
  }
}

AccountsBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
}

AccountsBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'D';
}

// AccountsBot.prototype._isPrivateMessage = function (message) {
//
// }

AccountsBot.prototype._isFromAccountsBot = function (message) {
    return message.user === this.user.id;
}

AccountsBot.prototype._isRegisterMessage = function (message) {
    return message.text.toLowerCase().indexOf('i am') > -1
}

AccountsBot.prototype._isExpenseRecordMessage = function (message) {
    return message.text.toLowerCase().indexOf('on') > message.text.toLowerCase().search('[0-9]')
}

AccountsBot.prototype._registerUser = function (message) {
  var messageArray = message.text.toLowerCase().split("am ")
  var name = messageArray[1]
  var userId = message.user
  var slackName = this._getUserById(userId).name
  console.log(slackName);
  userRepo.register(name, slackName)
  this.postMessageToUser(slackName, 'hello bro!');
}

AccountsBot.prototype._expenseRecord = function (message) {
  var self = this
  var userId = message.user
  var slackName = this._getUserById(userId).name
  userRepo.expenseRecord(slackName, message.text)
  .then(function (data) {
    self.postMessageToUser(slackName, data)
  }, function (err) {
    self.postMessageToUser(slackName, err)
  })

}

AccountsBot.prototype._getUserById = function (userId) {
    return this.users.filter(function (user) {
      console.log(user.id);
        return user.id === userId;
    })[0];
};

module.exports = AccountsBot
