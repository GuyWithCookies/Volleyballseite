// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  forename: String,
  surname: String,
  username: String,
  phone: String,
  password: String,
  email: String,
  picture: String, //just contains the local path
});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('users', User);
