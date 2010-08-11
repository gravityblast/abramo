var vows    = require('vows'),
    assert  = require('assert'),
    server  = require('../lib/abramo/server'),
    store   = require('../lib/abramo/store'),
    http    = require('http');
    
vows.describe('Store').addBatch({
  "should initialize store" : function() {
    var s = new server.Server();
    assert.ok(s.store instanceof store.Store);
  },
  
  "should initialize http server" : function() {
    var s = new server.Server();
    assert.ok(s.httpServer instanceof http.Server);
  }
}).run();