'use strict';

var express = require('express');

function Flow(options) {
  this._promise = Promise.resolve();
}

Flow.prototype = {
  _promise: null,
  _webhook: null,

  hook: function(path, type) {
    var that = this;
    if (type === 'web' && !this._webhook) {
      this._webhook = express();
    }
    this._promise = this._promise.then(() => {
      return Promise.resolve(path, type);
    });
    return {
      if: that._if.bind(that),
      trigger: that.trigger.bind(that),
    };
  },

  trigger: function(callback, data) {
    var that = this;
    this._promise = this._promise.then((path, type)  => {
      if (type === 'web') {
        this._webhook.get(path, (req, res)=> {
          // Send email here.
          res.send();
        });
      }
    });
    return {
      hook: that.hook.bind(that),
    };
  },

  _if: function(callback) {
    var that = this;
    return {
      trigger: that.trigger.bind(that),
    };
  },
};

module.exports = Flow;
