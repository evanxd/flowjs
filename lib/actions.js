'use strict';

var fs = require('fs');
var Mustache = require('mustache');
var Organization = require('./organization');
var org = new Organization();

function Actions() {}

Actions.prototype = {
  // Assign the value of _config and _mailServer when initialize index.js.
  _config: null,
  _mailServer: null,

  mail: function(toEmail, subject, templatePath, data) {
    var that = this;
    data.toEmail = toEmail;
    data.toName = org.getInfo(toEmail).name;
    data.applicantName = org.getInfo(data.applicantEmail).name;
    var content = Mustache.render(fs.readFileSync(templatePath, 'utf-8'), data);
    var message = {
      from: that._config.email.address,
      to: toEmail,
      subject: subject,
      text: content,
      attachment: { data: content, alternative: true }
    };
    this._mailServer.send(message, (err, message) => { console.log(err || message); });
  },
};

module.exports = Actions;
