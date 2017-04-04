'use strict';

var bodyParser = require('body-parser');
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
var Workflows = require('./lib/workflows');
var currentDir = path.dirname(module.filename);
var userDir = path.dirname(module.parent.filename);
var config = require(`${userDir}/flowjs.json`);
var members = require(`${userDir}/members.json`);

function Flow() {
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  var port = config.webhook.port || 8080;
  app.listen(port, function () {
    console.log(`Flow.js is listening on port ${port}!`);
  });
  this._app = app;
  this._serverAddress = `http://${ip.address()}:${port}`;
  this.actions = new Actions({ mailhook: config.mailhook, members: members });
}

Flow.prototype = {
  actions: null,
  _app: null,
  _mailhook: null,
  _serverAddress: null,

  setup: function(workflowName, callback) {
    var that = this;
    var webhookAddress = `${this._serverAddress}/${workflowName}`;
    this._app.route(`/${workflowName}`)
      .get((req, res) => {
        var data = req.query;
        if (data.apiKey === members[data.senderId].apiKey) {
          res.send(Mustache.render(fs.readFileSync(`${currentDir}/template/result.html`, 'utf-8'), {
            webhookAddress: webhookAddress,
          }));
        } else {
          res.jsonp({ result: 'fail', message: 'The API key is incorrect.', });
        }
      })
      .post((req, res) => {
        var data = req.body;
        if (data.apiKey === members[data.senderId].apiKey) {
          if (!data.id) {
            data.id = shortid.generate();
            fs.writeFileSync(`${userDir}/attachments/${data.id}.html`, data.application, 'utf-8');
          }
          data.webhookAddress = webhookAddress;
          if (typeof callback === 'function') {
            callback(data);
          } else if (typeof callback === 'object') {
            var workflow = callback.workflow || 'standar';
            var workflows = Workflows.createInstance(this.actions, callback);
            if (workflows) {
              workflows[workflow](data);
              res.jsonp({ result: 'success', });
            } else {
              res.jsonp({ result: 'fail', message: 'Cannot initialize a Workflows object.', });
            }
          }
        } else {
          res.jsonp({ result: 'fail', message: 'The API key is incorrect.', });
        }
      });
    return {
      mailhook: that.mailhook.bind(that),
    };
  },

  // FIXME: This should be a private method.
  mailhook: function(params) {
    this._mailhook = this._mailhook ||
                     new Mailhook(config.mailhook.user, config.mailhook.password,
                                  config.mailhook.imapHost);
    this._mailhook.hook(params.email)
      .trigger(data => {
        if (data.subject === params.subject) {
          var applicantId = jsdom.jsdom(data.html)
                                 .querySelector(params.applicantIdSelector).textContent;
          members[applicantId] ?
            request.post({
              // FIXME: Do not use params.subject to build the webhook address.
              url: `${this._serverAddress}/${params.subject}`,
              json: {
                senderId: applicantId,
                applicantId: applicantId,
                application: data.html,
                apiKey: members[applicantId].apiKey,
              },
            },
            (error, response, body) => {
              error ? console.log(error.message) : console.log(body);
            }) : console.log(`Cannot find out the ${applicantId} applicantId in members.json.`);
        }
      });
  },
};

module.exports = new Flow();
