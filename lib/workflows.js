'use strict';

function Workflows (actions, organization, params = {}) {
  this._actions = actions;
  this._organization = organization;
  this._params = params;
}

Workflows.prototype = {
  _actions: null,
  _organization: null,
  _params: null,

  classic: function (data) {
    if (data.email === data.applicantEmail) {
      this._actions.mail(this._organization.findManager(data.email).email,
        this._params.requestMailSubject, this._params.requestMailContent, data);
    } else if (data.email != this._params.approverEmail) {
      if (data.approved) {
        this._actions.mail(this._organization.findManager(data.email).email,
          this._params.requestMailSubject, this._params.requestMailContent, data);
      } else {
        this._actions.mail(data.applicantEmail,
          this._params.rejectionMailSubject, this._params.rejectionMailContent, data);
      }
    } else if (data.email === this._params.approverEmail) {
      if (data.approved) {
        this._actions.mail(data.applicantEmail,
          this._params.approvalMailSubject, this._params.approvalMailContent, data);
      } else {
        this._actions.mail(data.applicantEmail,
          this._params.rejectionMailSubject, this._params.rejectionMailContent, data);
      }
    }
  },
};

module.exports = Workflows;
