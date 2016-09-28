// competitions model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Competition = new Schema({
  id: Number,
  name: String,
  own: String,
  place: String,
  date: Date,
  description: String,
  report: String,
  done: Boolean,
  members: Array
});

module.exports = mongoose.model('competition', Competition);
