'use strict';

function Actions() {}

Actions.prototype = {
  // Assign the value of _config and _mailServer when initialize index.js.
  _config: null,
  _mailServer: null,

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

module.exports = Actions;
