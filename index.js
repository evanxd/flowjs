'use strict';

var fs = require('fs');
var path = require('path');
var Flow = require('./lib/flow');
var userDir = path.dirname(module.parent.filename);
var options = require(`${userDir}/flowjs.json`);
var members = require(`${userDir}/members.json`);

// Setup the Flow.js runtime environment.
// Ensure users have already created the attachments directory.
// If not, create for them.
if (!fs.existsSync(`${userDir}/attachments/`)) {
  fs.mkdirSync(`${userDir}/attachments/`)
}

module.exports = new Flow(members, options);
