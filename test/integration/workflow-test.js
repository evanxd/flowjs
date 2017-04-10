var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');
var request = require('request');
var currentDir = path.dirname(module.filename);
var flow;

describe('Workflow', function() {
  describe('Setup a workflow', function() {
    before(function() {
      flow = require('../../index');
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
    });

    after(function() {
      flow.shutdown();
      // Remove the flow module cache to force to renew a flow instance.
      delete require.cache[require.resolve('../../index')];
    });

    it('should get success result', function(done) {
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

    it('should get fail result when the API key is incorrect', function(done) {
      request.post({
          url: 'http://localhost:8080/expenditure-application-workflow',
          json: {
            senderId: 'vtyler',
            applicantId: 'vtyler',
            application: '<div>Application content.</div>',
            apiKey: 'fake-api-key',
          },
        },
        function(error, response, body) {
          assert.equal(body.result, 'fail');
          assert.equal(body.message, 'The API key is incorrect.');
          done();
        });
    });

    it('should get fail result when sender is not listed in members.json', function(done) {
      request.post({
          url: 'http://localhost:8080/expenditure-application-workflow',
          json: {
            senderId: 'someIdNotListedInMemberJson',
            applicantId: 'someIdNotListedInMemberJson',
            application: '<div>Application content.</div>',
            apiKey: 'fake-api-key',
          },
        },
        function(error, response, body) {
          assert.equal(body.result, 'fail');
          assert.equal(body.message, 'No such sender ID.');
          done();
        });
    });
  });

  describe('Setup a workflow with incorrect callback function', function() {
    before(function() {
      flow = require('../../index');
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
    });

    after(function() {
      flow.shutdown();
      // Remove the flow module cache to force to renew a flow instance.
      delete require.cache[require.resolve('../../index')];
    });

    it('should get fail result', function(done) {
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
