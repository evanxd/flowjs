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

  mail: function(email, subject, templatePath, data) {
    var that = this;
    var receiver = org.getInfo(email);
    var applicant = org.getInfo(data.applicantEmail);
    var approveButton = `<a href="${data.webhookAddress}/?id=${data.id}&email=${email}&applicantEmail=${data.applicantEmail}&items=${data.items}&apiKey=${receiver.apiKey}&approved=true"><button>Approve</button></a>`
    var rejectButton =  `<a href="${data.webhookAddress}/?id=${data.id}&email=${email}&applicantEmail=${data.applicantEmail}&items=${data.items}&apiKey=${receiver.apiKey}&approved=false"><button>Reject</button></a>`
    var content = Mustache.render(fs.readFileSync(templatePath, 'utf-8'), {
      receiverName: receiver.name,
      applicantName: applicant.name,
      items: data.items,
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
