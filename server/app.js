// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var flow = require('./flow-node.js')('../client/public/img/uploads');

// mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/volleyball');

// schema/models
var User = require('./models/user.js');
var Training = require("./models/training.js");
var Competition = require("./models/competition.js");

// create instance of express
var app = express();

// require userRoutes
var userRoutes = require('./routes/userApi.js');
var trainingRoutes = require('./routes/trainingApi.js');
var competitionRoutes = require('./routes/competitionsApi.js');

// define middleware
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge: 3600000*1000}
}));
app.use(passport.initialize());
app.use(passport.session());


// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/user/', userRoutes);
app.use('/training/', trainingRoutes);
app.use('/competition/', competitionRoutes);


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/public/', 'index.html'));
});

// Handle uploads through Flow.js
app.post('/uploadImg', multipartMiddleware, function(req, res) {
    flow.post(req, function(status, filename, original_filename, identifier) {
        res.status(/^(partly_done|done)$/.test(status) ? 200 : 500).send();
    });
});

// error handlers
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    console.log(req.path);
    err.status = 404;
    next(err);
});

app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.end(JSON.stringify({
        message: err.message,
        error: {}
    }));
});

module.exports = app;
