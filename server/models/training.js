// training model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Training = new Schema({
  date: Date,
  food: {username:String, supplied:Boolean},
  drink: {username:String, supplied:Boolean},
  appear: Array,
  maybe: Array,
  not: Array,
  comments: [{message: String, createDate: Date, username: String}]
});

module.exports = mongoose.model('training', Training);
