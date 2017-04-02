'use strict';

var bodyParser = require('body-parser');
var email = require('emailjs');
var express = require('express');
var ip = require('ip');
var fs = require('fs');
var jsdom = require('jsdom');
var path = require('path');
var request = require('request');
var shortid = require('shortid');
var Actions = require('./lib/actions');
var Mailhook = require('mailhook');
var Mustache = require('mustache');
var Organization = require('./lib/organization');
var Workflows = require('./lib/workflows');
var userDir = path.dirname(module.parent.filename);
var currentDir = path.dirname(module.filename);
var config = require(`${userDir}/flowjs.json`);

function Flow() {
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  var port = config.webhook.port || 8080;
  app.listen(port, function () {
    console.log(`Flow.js is listening on port ${port}!`);
  });
  this._app = app;

  this._orgDoc = jsdom.jsdom(fs.readFileSync(`${userDir}/member.xml`, 'utf-8'));
  Actions.prototype._config = config;
  if (config.mailhook && config.mailhook.user &&
      config.mailhook.password && config.mailhook.smtpHost && config.mailhook.imapHost) {
    Actions.prototype._mailServer = email.server.connect({
     user: config.mailhook.user, password: config.mailhook.password,
     host: config.mailhook.smtpHost, ssl: config.mailhook.ssl
    });

    this._mailhook = new Mailhook(config.mailhook.user, config.mailhook.password,
                                config.mailhook.imapHost);
  } else {
    console.log('Has to input email information to send emails.');
  }
  Organization.prototype._orgDoc = this._orgDoc;

  this._serverAddress = `http://${ip.address()}:${port}`;
  this.actions = new Actions();
  this.organization = new Organization();
}

Flow.prototype = {
  actions: null,
  organization: null,
  _app: null,
  _mailhook: null,
  _orgDoc: null,
  _serverAddress: null,

  setup: function(workflowName, callback) {
    var webhookAddress = `${this._serverAddress}/${workflowName}`;

    this._app.route(`/${workflowName}`)
      .get((req, res) => {
        var data = req.query;
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
          if (!data.id) {
            data.id = shortid.generate();
            fs.writeFileSync(`${userDir}/attachments/${data.id}.html`, data.application, 'utf-8');
          }
          data.webhookAddress = webhookAddress;
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

  mailhook: function(params) {
    var that = this;
    var hook = this._mailhook.hook(params.fromEmail);
    return {
      trigger: function(workflowName, triggerParams) {
        var webhookAddress = `${that._serverAddress}/${workflowName}`;
        hook.trigger(data => {
          if (data.subject === params.subject) {
            var doc = jsdom.jsdom(data.html);
            var applicantEmail = doc.querySelector(triggerParams.applicantEmailSelector).textContent;
            request.post({
              url: webhookAddress,
              json: {
                email: applicantEmail,
                applicantEmail: applicantEmail,
                application: data.html,
                apiKey: that.organization.getInfo(applicantEmail).apiKey,
              },
            },
            (error, response, body) => {
              error ? console.log(error.message) : console.log(body);
            });
          }
        });
      },
    }
  },
};

module.exports = new Flow();
