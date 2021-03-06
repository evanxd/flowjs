'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var ip = require('ip');
var fs = require('fs');
var jsdom = require('jsdom');
var request = require('request');
var path = require('path');
var shortid = require('shortid');
var Actions = require('./actions');
var Mailhook = require('mailhook');
var Mustache = require('mustache');
var Workflows = require('./workflows');
var userDir = path.dirname(module.parent.parent.filename);

function Flow(members, options = {}) {
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  var port = options.webhook.port || 8080;
  this._server = app.listen(port, function () {
    options.debug && console.log(`Flow.js is listening on port ${port}!`);
  });
  this._app = app;
  this._options = options;
  this._serverAddress = `http://${ip.address()}:${port}`;
  this._members = members;
  this.actions = new Actions({ mailhook: this._options.mailhook, members: members });
}

Flow.prototype = {
  actions: null,
  _app: null,
  _mailhook: null,
  _members: null,
  _options: null,
  _server: null,
  _serverAddress: null,

  setup: function(workflowName, callback) {
    var that = this;
    var webhookAddress = `${this._serverAddress}/${workflowName}`;
    this._app.route(`/${workflowName}`)
      .get((req, res) => {
        var data = req.query;
        if (data.apiKey === this._members[data.senderId].apiKey) {
          res.send(Mustache.render(fs.readFileSync(`${currentDir}/template/result.html`, 'utf-8'), {
            webhookAddress: webhookAddress,
          }));
        } else {
          res.jsonp({ result: 'fail', message: 'The API key is incorrect.', });
        }
      })
      .post((req, res) => {
        var data = req.body;
        var sender = this._members[data.senderId];
        if (sender && sender.apiKey === data.apiKey) {
          if (!data.id) {
            data.id = shortid.generate();
            fs.writeFileSync(`${userDir}/attachments/${data.id}.html`, data.application, 'utf-8');
          }
          data.webhookAddress = webhookAddress;
          if (typeof callback === 'function') {
            try {
              callback(data);
              res.jsonp({ result: 'success', });
            } catch (error) {
              res.jsonp({ result: 'fail', message: error.message });
            }
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
        } else if (!sender) {
          res.jsonp({ result: 'fail', message: 'No such sender ID.' });
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
                     new Mailhook(this._options.mailhook.user, this._options.mailhook.password,
                                  this._options.mailhook.imapHost);
    this._mailhook.hook(params.email)
      .trigger(data => {
        if (data.subject === params.subject) {
          var applicantIdSelector = params.applicantIdSelector ||
                                    // Select the first item on the google form,
                                    // and that is the member ID.
                                    'table tr:first-child td:last-child';
          var applicantId = jsdom.jsdom(data.html)
                                 .querySelector(applicantIdSelector).textContent;
          this._members[applicantId] ?
            request.post({
              // FIXME: Do not use params.subject to build the webhook address.
              url: `${this._serverAddress}/${params.subject}`,
              json: {
                senderId: applicantId,
                applicantId: applicantId,
                application: data.html,
                apiKey: this._members[applicantId].apiKey,
              },
            },
            (error, response, body) => {
              error ? console.log(error.message) : console.log(body);
            }) : console.log(`Cannot find out the ${applicantId} applicantId in this._members.json.`);
        }
      });
  },

  shutdown: function() {
    this._server.close();
  },
};

module.exports = Flow;
