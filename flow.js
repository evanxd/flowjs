'use strict';

var express = require('express');
var email = require('emailjs');

function Flow(options = {}) {
  this._app = express();
  this._options = options;
  if (options.email && options.email.user &&
      options.email.password && options.email.host) {
    email.server.connect({
     user: options.email.user, password: options.email.password,
     host: options.email.host, ssl: options.email.ssl
    });
  }
}

Flow.prototype = {
  _app: null,
  _mailServer: null,
  _options: null,

  setup: function(path, callback) {
    this._app.route(path).post(function(req, res) {
      callback && callback(req.body);
      res.jsonp({ result: 'success' });
    });
  },

  mail: function(toEmail, subject, content) {
    var message = {
      from: this._options.email && this._options.email.address ? this._options.email.address : null, 
      to: toEmail,
      subject: subject,
      text: content,
    };
    this._mailServer.send(message, (err, message) => { console.log(err || message); });
  },
};

module.exports = Flow;
