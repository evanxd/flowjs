'use strict';

var bodyParser = require('body-parser');
var email = require('emailjs');
var express = require('express');
var fs = require('fs');
var jsdom = require('jsdom');
var path = require('path');

var Flow = require('./lib/flow');
var Organization = require('./lib/organization');
var parentDir = path.dirname(module.parent.filename);
var config = require(`${parentDir}/flowjs.json`);

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

var memberXML = fs.readFileSync(`${parentDir}/member.xml`, 'utf-8');
var orgDoc = jsdom.jsdom(memberXML);

Flow.prototype._app = app;
Flow.prototype._config = config;
Flow.prototype._mailServer = mailServer;
Flow.prototype._orgDoc = orgDoc;
Organization.prototype._orgDoc = orgDoc;

module.exports = {
  Flow: Flow,
  Organization: Organization,
};
