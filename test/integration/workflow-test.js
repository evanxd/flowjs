var assert = require('chai').assert;
var request = require('request');
var flow;

describe('Workflow', function() {
  describe('Setup a workflow', function() {
    before(function() {
      flow = require('../../index');
    });

    it('should successfully setup a workflow', function(done) {
      flow.setup('expenditure-application-workflow', function(data) {
        assert.isDefined(data.id);
        // TODO: Add regular expression to check the webhookAddress.
        assert.isDefined(data.webhookAddress);
        assert.equal(data.senderId, 'vtyler');
        assert.equal(data.applicantId, 'vtyler');
        assert.equal(data.application, '<div>Application content.</div>');
        assert.equal(data.apiKey, '81a2748e-34ec-481c-87dd-923c96216193');
        assert.equal(6, Object.keys(data).length);
      });
      request.post({
          url: 'http://localhost:8080/expenditure-application-workflow',
          json: {
            senderId: 'vtyler',
            applicantId: 'vtyler',
            application: '<div>Application content.</div>',
            apiKey: '81a2748e-34ec-481c-87dd-923c96216193',
          },
        },
        function(error, response, body) {
          assert.equal(body.result, 'success');
          done();
        });
    });
  });
});
