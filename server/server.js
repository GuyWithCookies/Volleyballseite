#!/usr/bin/env node

var debug = require('debug')('passport-mongo');
var app = require('./app');


app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP);

var server = app.listen(app.get('port'), app.get("ip"), function() {
  console.log("Express server listening on port " + server.address().port);
  debug('Express server listening on port ' + server.address().port);
});