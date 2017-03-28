'use strict';

var config = require('./flowjs.json');

function Flow() {}

Flow.prototype = {
  _app: null,
  _mailServer: null,

  setup: function(path, callback) {
    this._app.route(path).get(function(req, res) {
      callback && callback(req.query);
      res.jsonp({ result: 'success' });
    });
  },

  mail: function(toEmail, subject, content) {
    var message = {
      from: config.email.address,
      to: toEmail,
      subject: subject,
      text: content,
      attachment: { data: `<html>${content}</html>`, alternative: true }
    };
    this._mailServer.send(message, (err, message) => { console.log(err || message); });
  },
};

module.exports = Flow;
