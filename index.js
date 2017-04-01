'use strict';

var bodyParser = require('body-parser');
var email = require('emailjs');
var express = require('express');
var dns = require('dns');
var os = require('os');
var fs = require('fs');
var jsdom = require('jsdom');
var path = require('path');
var shortid = require('shortid');
var Actions = require('./lib/actions');
var Mustache = require('mustache');
var Organization = require('./lib/organization');
var Workflows = require('./lib/workflows');
var parentDir = path.dirname(module.parent.filename);
var currentDir = path.dirname(module.filename);
var config = require(`${parentDir}/flowjs.json`);

function Flow() {
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  var port = config.webhook.port || 8080;
  app.listen(port, function () {
    console.log(`Flow.js is listening on port ${port}!`);
  });
  this._app = app;

  this._orgDoc = jsdom.jsdom(fs.readFileSync(`${parentDir}/member.xml`, 'utf-8'));
  Actions.prototype._config = config;
  if (config.email && config.email.user &&
      config.email.password && config.email.host) {
    Actions.prototype._mailServer = email.server.connect({
     user: config.email.user, password: config.email.password,
     host: config.email.host, ssl: config.email.ssl
    });
  } else {
    console.log('Has to input email information to send emails.');
  }
  Organization.prototype._orgDoc = this._orgDoc;

  dns.lookup(os.hostname(), (error, address) => {
    if (!error) {
      this._serverAddress = `http://${address}:${port}`;
    }
  });

  this.actions = new Actions();
  this.organization = new Organization();
}

Flow.prototype = {
  actions: null,
  organization: null,
  _app: null,
  _orgDoc: null,
  _serverAddress: null,

  setup: function(workflowName, callback) {
    this._app.route(`/${workflowName}`)
      .get((req, res) => {
        var data = req.query;
        var webhookAddress = `${this._serverAddress}/${workflowName}`;
        var receiver = this._orgDoc.querySelector(`[email="${data.email}"]`);
        if (receiver && data.apiKey === receiver.getAttribute('apiKey')) {
          res.send(Mustache.render(fs.readFileSync(`${currentDir}/template/result.html`, 'utf-8'), {
            webhookAddress: webhookAddress,
          }));
        } else {
          res.jsonp({ result: 'fail', message: 'The API key is incorrect.', });
        }
      })
      .post((req, res) => {
        var data = req.body;
        var receiver = this._orgDoc.querySelector(`[email="${data.email}"]`);
        if (receiver && data.apiKey === receiver.getAttribute('apiKey')) {
          data.id = data.id || shortid.generate();
          data.webhookAddress = `${this._serverAddress}/${workflowName}`;
          if (typeof callback === 'function') {
            callback(data);
          } else if (typeof callback === 'object') {
            var workflow = callback.workflow || 'classic';
            var workflows = new Workflows(this.actions, this.organization, callback);
            workflows[workflow](data);
          }
          res.jsonp({ result: 'success', });
        } else {
          res.jsonp({ result: 'fail', message: 'The API key is incorrect.', });
        }
      });
  },
};

module.exports = new Flow();
