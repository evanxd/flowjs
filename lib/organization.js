'use strict';

var jsdom = require('jsdom');
var fs = require('fs');

function Organization() {
  var memberXML = fs.readFileSync('./member.xml', "utf-8");
  this._orgDoc = jsdom.jsdom(memberXML);
}

Organization.prototype = {
  _orgDoc: null,

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
