var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');
var request = require('request');
var currentDir = path.dirname(module.filename);
var flow;

describe('Workflow', function() {
  beforeEach(function() {
    flow = require('../../index');
  });

  afterEach(function() {
    flow.close();
    // Remove the flow module cache to force to renew a flow instance.
    delete require.cache[require.resolve('../../index')];
  });

  describe('Setup a workflow', function() {
    it('should successfully setup a workflow and trigger the callback', function(done) {
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

    it('should get fail result when the callback function goes wrong', function(done) {
      flow.setup('expenditure-application-workflow', function(data) {
        assert.isDefined(data.id);
        // TODO: Add regular expression to check the webhookAddress.
        assert.isDefined(data.webhookAddress);
        assert.equal(data.senderId, 'vtyler');
        assert.equal(data.applicantId, 'vtyler');
        assert.equal(data.application, '<div>Application content.</div>');
        assert.equal(data.apiKey, '81a2748e-34ec-481c-87dd-923c96216193');
        assert.equal(6, Object.keys(data).length);
        throw new Error('Go wrong.');
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
          assert.equal(body.result, 'fail');
          assert.equal(body.message, 'Go wrong.');
          done();
        });
    });
  });
});
