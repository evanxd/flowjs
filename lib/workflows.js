'use strict';

var path = require('path');
var currentDir = path.dirname(module.filename);
var userDir = path.dirname(module.parent.parent.filename);
var members = require(`${userDir}/members.json`);

function Workflows (actions, params = {}) {
  this._actions = actions;
  this._params = params;
}

Workflows.prototype = {
  _actions: null,
  _params: null,

  standar: function (data) {
    var managerId = members[data.senderId].manager;
    var applicantEmail = members[data.applicantId].email;
    if (data.senderId === data.applicantId) {
      data.senderId = managerId;
      this._actions.mail(members[managerId].email,
        this._params.requestMailSubject || 'Request An Approval',
        this._params.requestMailContent || `${currentDir}/../template/standar-workflow/request.html`, data);
    } else if (data.senderId != this._params.approverId) {
      if (data.approved) {
        data.senderId = managerId;
        this._actions.mail(members[managerId].email,
          this._params.requestMailSubject || 'Request An Approval',
          this._params.requestMailContent || `${currentDir}/../template/standar-workflow/request.html`, data);
      } else {
        this._actions.mail(applicantEmail,
          this._params.rejectionMailSubject || 'The Application Is Rejected',
          this._params.rejectionMailContent || `${currentDir}/../template/standar-workflow/rejection.html`, data);
      }
    } else if (data.senderId === this._params.approverId) {
      if (data.approved) {
        this._actions.mail(applicantEmail,
          this._params.approvalMailSubject || 'Got The Approval',
          this._params.approvalMailContent || `${currentDir}/../template/standar-workflow/approval.html`, data);
      } else {
        this._actions.mail(applicantEmail,
          this._params.rejectionMailSubject || 'The Application Is Rejected',
          this._params.rejectionMailContent || `${currentDir}/../template/standar-workflow/rejection.html`, data);
      }
    }
  },
};

module.exports = Workflows;
