'use strict';

function Organization() {}

Organization.prototype = {
  // Assign the value when initialize index.js.
  _orgDoc: null,

  getInfo: function(email) {
    try {
      var member = this._orgDoc.querySelector(`[email="${email}"]`);
      return member ? {
        name: member.getAttribute('name'),
        email: member.getAttribute('email'),
        title: member.getAttribute('title'),
        department: member.getAttribute('department'),
        apiKey: member.getAttribute('apiKey'),
      } : {};
    } catch (e) {
      console.error(e.message);
      return {};
    }
  },

  findManager: function(email) {
    try {
      var manager = this._orgDoc.querySelector(`[email="${email}"]`).parentNode;
      return manager ? {
        name: manager.getAttribute('name'),
        email: manager.getAttribute('email'),
        title: manager.getAttribute('title'),
        department: manager.getAttribute('department'),
        apiKey: manager.getAttribute('apiKey'),
      } : {};
    } catch (e) {
      console.error(e.message);
      return {};
    }
  },
};

module.exports = Organization;
