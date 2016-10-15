// competitions model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Competition = new Schema({
    id: Number,
    name: String,
    own: Boolean,
    place: String,
    date: Date,
    description: String,
    report: [String, String, Boolean],
    done: Boolean,
    comments: [{message: String, username: String}],
    members: Array
});

module.exports = mongoose.model('competition', Competition);
