'use strict';

function Flow() {}

Flow.prototype = {
  // Assign the value to _app, _config, _mailServer, and _orgDoc then initialize index.js.
  _app: null,
  _config: null,
  _mailServer: null,
  _orgDoc: null,

  setup: function(workflowName, callback) {
    this._app.route(`/${workflowName}`).get((req, res) => {
      var params = req.query;
      if (params.apiKey === this._orgDoc.querySelector(`[email="itoyxd@gmail.com"]`)
                                        .getAttribute('apiKey')) {
        callback && callback(params);
        res.jsonp({ result: 'success', });
      } else {
        res.jsonp({ result: 'fail', message: 'The API key is incorrect.', });
      }
    });
  },

  mail: function(toEmail, subject, content) {
    var that = this;
    var message = {
      from: that._config.email.address,
      to: toEmail,
      subject: subject,
      text: content,
      attachment: { data: `<html>${content}</html>`, alternative: true }
    };
    this._mailServer.send(message, (err, message) => { console.log(err || message); });
  },
};

module.exports = Flow;
