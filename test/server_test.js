var abramo  = require('../lib/abramo'),
    vows    = require('vows'),
    assert  = require('assert'),
    http    = require('http');
    
vows.describe('Store').addBatch({
  "should initialize store" : function() {
    var s = new abramo.Server();
    assert.ok(s.store instanceof abramo.Store);
  },
  
  "should initialize http server" : function() {
    var s = new abramo.Server();
    assert.ok(s.httpServer instanceof http.Server);
  }
}).run();