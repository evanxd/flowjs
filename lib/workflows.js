'use strict';

var path = require('path');
var userDir = path.dirname(module.parent.parent.filename);
var members = require(`${userDir}/members.json`);

function Workflows (actions, params = {}) {
  this._actions = actions;
  this._params = params;
}

Workflows.prototype = {
  _actions: null,
  _params: null,

  classic: function (data) {
    var managerId = members[data.senderId].manager;
    var applicantEmail = members[data.applicantId].email;
    if (data.senderId === data.applicantId) {
      data.senderId = managerId;
      this._actions.mail(members[managerId].email,
        this._params.requestMailSubject, this._params.requestMailContent, data);
    } else if (data.senderId != this._params.approverId) {
      if (data.approved) {
        data.senderId = managerId;
        this._actions.mail(members[managerId].email,
          this._params.requestMailSubject, this._params.requestMailContent, data);
      } else {
        this._actions.mail(applicantEmail,
          this._params.rejectionMailSubject, this._params.rejectionMailContent, data);
      }
    } else if (data.senderId === this._params.approverId) {
      if (data.approved) {
        this._actions.mail(applicantEmail,
          this._params.approvalMailSubject, this._params.approvalMailContent, data);
      } else {
        this._actions.mail(applicantEmail,
          this._params.rejectionMailSubject, this._params.rejectionMailContent, data);
      }
    }
  },
};

module.exports = Workflows;
