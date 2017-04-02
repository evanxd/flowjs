'use strict';

var fs = require('fs');
var Mustache = require('mustache');
var urlencode = require('urlencode');
var path = require('path');
var Organization = require('./organization');
var org = new Organization();
var userDir = path.dirname(module.parent.parent.filename);

function Actions() {}

Actions.prototype = {
  // Assign the value of _config and _mailServer when initialize index.js.
  _config: null,
  _mailServer: null,

  mail: function(email, subject, templatePath, data) {
    var that = this;
    var receiver = org.getInfo(email);
    var applicant = org.getInfo(data.applicantEmail);
    var approveButton = `<a href="${data.webhookAddress}/?id=${data.id}&email=${email}&applicantEmail=${data.applicantEmail}&apiKey=${receiver.apiKey}&approved=true"><button>Approve</button></a>`
    var rejectButton =  `<a href="${data.webhookAddress}/?id=${data.id}&email=${email}&applicantEmail=${data.applicantEmail}&apiKey=${receiver.apiKey}&approved=false"><button>Reject</button></a>`
    var content = Mustache.render(fs.readFileSync(templatePath, 'utf-8'), {
      receiverName: receiver.name,
      applicantName: applicant.name,
      application: fs.readFileSync(`${userDir}/attachments/${data.id}.html`, 'utf-8'),
      webhookAddress: data.webhookAddress,
      approveButton: approveButton,
      rejectButton: rejectButton,
    });
    var message = {
      from: that._config.mailhook.address,
      to: email,
      subject: `ID ${data.id} - ${subject}`,
      text: content,
      attachment: { data: content, alternative: true }
    };
    this._mailServer.send(message, (err, message) => { console.log(err || message); });
  },
};

module.exports = Actions;