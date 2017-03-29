'use strict';

var config = require('./flowjs.json');
var express = require('express');
var bodyParser = require('body-parser');
var email = require('emailjs');
var Flow = require('./lib/flow');
var Organization = require('./lib/organization');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = config.webhook.port || 8080;
app.listen(port, function () {
  console.log(`The Flow.js Webhook is listening on port ${port}!`);
});

if (config.email && config.email.user &&
    config.email.password && config.email.host) {
  var mailServer = email.server.connect({
   user: config.email.user, password: config.email.password,
   host: config.email.host, ssl: config.email.ssl
  });
}

Flow.prototype._app = app;
Flow.prototype._mailServer = mailServer;

module.exports = {
  Flow: Flow,
  Organization: Organization,
};
