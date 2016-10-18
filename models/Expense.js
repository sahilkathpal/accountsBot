var mongoose = require('mongoose')

var expenseSchema = mongoose.Schema({
  user: String,
  description: String,
  amount: Number,
  date: Date
})

module.exports = mongoose.model('Expense', expenseSchema)
