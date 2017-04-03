'use strict';

var email = require('emailjs');
var fs = require('fs');
var path = require('path');
var Mustache = require('mustache');
var userDir = path.dirname(module.parent.parent.filename);

function Actions(params) {
  this._config = params.mailhook;
  this._members = params.members;
  if (this._config && this._config.user && this._config.password &&
      this._config.smtpHost && this._config.imapHost) {
    this._mailServer = email.server.connect({
     user: this._config.user, password: this._config.password,
     host: this._config.smtpHost, ssl: this._config.ssl
    });
  } else {
    console.log('Has to input email information to send emails.');
  }
}

Actions.prototype = {
  _config: null,
  _members: null,
  _mailServer: null,

  mail: function(email, subject, templatePath, data) {
    var that = this;
    var approveButton = `<a href="${data.webhookAddress}/?id=${data.id}&senderId=${data.senderId}&applicantId=${data.applicantId}&apiKey=${this._members[data.senderId].apiKey}&approved=true"><button>Approve</button></a>`
    var rejectButton =  `<a href="${data.webhookAddress}/?id=${data.id}&senderId=${data.senderId}&applicantId=${data.applicantId}&apiKey=${this._members[data.senderId].apiKey}&approved=false"><button>Reject</button></a>`
    var content = Mustache.render(fs.readFileSync(templatePath, 'utf-8'), {
      senderName: this._members[data.senderId].name,
      applicantName: this._members[data.applicantId].name,
      application: fs.readFileSync(`${userDir}/attachments/${data.id}.html`, 'utf-8'),
      webhookAddress: data.webhookAddress,
      approveButton: approveButton,
      rejectButton: rejectButton,
    });
    var message = {
      from: that._config.address,
      to: email,
      subject: `ID ${data.id} - ${subject}`,
      text: content,
      attachment: { data: content, alternative: true }
    };
    this._mailServer.send(message, (err, message) => { console.log(err || message); });
  },
};

module.exports = Actions;
