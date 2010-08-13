var abramo  = require('../lib/abramo'),
    vows    = require('vows'),
    assert  = require('assert'),
    http    = require('http'),
    helper  = require('./test_helper');
    
vows.describe('Store').addBatch({
  "should initialize http server" : function() {
    var s = new abramo.Server({}, new helper.FakeStore());
    assert.ok(s.httpServer instanceof http.Server);
  }
}).run();