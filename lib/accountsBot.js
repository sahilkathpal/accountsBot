var util = require('util')
var Bot = require('slackbots')
var userRepo = require('../repositories/UserRepository')

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

AccountsBot.prototype._onMessage = function () {
  if (! this._isChatMessage(message) || ! this._isChannelConversation(message) || _.isFromAccountsBot(message)) return
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
        message.channel[0] === 'C';
}

AccountsBot.prototype._isPrivateMessage = function (message) {

}

AccountsBot.prototype._isFromAccountsBot = function (message) {
    return message.user === this.user.id;
}

AccountsBot.prototype._isRegisterMessage = function (message) {
    return message.text.toLowerCase().indexOf('i am') > -1
}

AccountsBot.prototype._registerUser = function (message) {
  var messageArray = message.text.toLowerCase().split(" ")
  var flag = false
  _.forEach(messageArray, function (word) {
    if (flag) return word
    if (word === 'am') flag = true
  })
  var userId = message.user
  var slackName = this._getUserById(userId)
  userRepo.register(word, slackName)
  this.postMessageToUser(, 'hello bro!');
}

AccountsBot.prototype._getUserById = function (userId) {
    return this.users.filter(function (item) {
        return item.id === userId;
    })[0];
};

module.exports = AccountsBot
