'use strict';

var jsdom = require('jsdom');

function Organization() {
  this._orgDoc = jsdom.jsdom(this._memberXML);
}

Organization.prototype = {
  _orgDoc: null,
  _memberXML: null // Assign the value then initialize index.js.

  findManager: function(email) {
    try {
      var manager = this._orgDoc.querySelector(`[email="${email}"]`).parentNode;
      return manager ? {
        name: manager.getAttribute('name'),
        email: manager.getAttribute('email'),
        title: manager.getAttribute('title'),
        department: manager.getAttribute('department'),
      } : null;
    } catch (e) {
      console.error(e.message);
      return null;
    }
  },
};

module.exports = Organization;
