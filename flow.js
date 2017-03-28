'use strict';

var config = require('./flowjs.json');

function Flow() {}

Flow.prototype = {
  _app: null,
  _mailServer: null,

  setup: function(path, callback) {
    this._app.route(path).post(function(req, res) {
      callback && callback(req.body);
      res.jsonp({ result: 'success' });
    });
  },

  mail: function(toEmail, subject, content) {
    var message = {
      from: config.email.address, 
      to: toEmail,
      subject: subject,
      text: content,
    };
    this._mailServer.send(message, (err, message) => { console.log(err || message); });
  },
};

module.exports = Flow;
