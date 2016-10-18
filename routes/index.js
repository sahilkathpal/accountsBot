var express = require('express');
var router = express.Router();
var _ = require('lodash')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/excel', function (req, res) {
  var Expense = require('../models/Expense')
  var XLSX = require('xlsx')
  Expense.find({'user': 'sahil kathpal'}, function (err, expenses) {
    if (err) return res.sendStatus('500')

    var ws_name = "SheetJS";
    var ws = {}
    var range = {s: {c:0, r:0}, e: {c:20, r:20 }}
    var cell = {v: "Date"}
    var cell_ref = XLSX.utils.encode_cell({c:0,r:0})
    cell.t = 's'
    ws[cell_ref] = cell
    var cell = {v: "Desc"}
    var cell_ref = XLSX.utils.encode_cell({c:1,r:0})
    cell.t = 's'
    ws[cell_ref] = cell
    var cell = {v: "Amount"}
    var cell_ref = XLSX.utils.encode_cell({c:2,r:0})
    cell.t = 's'
    ws[cell_ref] = cell
    var i = 1
    _.forEach(expenses, function (expense) {
      var j = 0
      var cell = {v: expense.date}
      var cell_ref = XLSX.utils.encode_cell({c:j,r:i})
      cell.t = 's'
      ws[cell_ref] = cell
      var cell = {v: expense.description}
      var cell_ref = XLSX.utils.encode_cell({c:++j,r:i})
      cell.t = 's'
      ws[cell_ref] = cell
      var cell = {v: expense.amount+''}
      var cell_ref = XLSX.utils.encode_cell({c:++j,r:i})
      cell.t = 's'
      ws[cell_ref] = cell
      i++
    })
    ws['!ref'] = XLSX.utils.encode_range(range)
    // var wb = new WorkBook()
    var wb = []
    wb.SheetNames = []
    wb.Sheets = {}
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    XLSX.writeFile(wb, 'out.xlsx')
  })
  // console.log(XLSX)
})

module.exports = router;
