'use strict';

function Team(teamHierarchy) {

}

Team.prototype = {
  _teamHierarchy: null,

  findManager: function(email) {
    return {
      name: "Your Name",
      email: "your-name@samples.com",
    };
  },
};

module.exports = Team;
