var abramo      = require('../lib/abramo'),
    vows        = require('vows'),
    assert      = require('assert'),    
    events      = require('events'),
    helper      = require('./test_helper');


vows.describe('Response').addBatch({
  "should save data if http method is PUT" : function() {
    var fakeHttpRequest = new helper.FakeHttpRequest();    
    var s = new abramo.Store();
    fakeHttpRequest.method = "PUT";
    var c = new abramo.Connection(s, fakeHttpRequest, {});
    fakeHttpRequest.emit("data", "this is ");
    fakeHttpRequest.emit("data", "the request body");
    assert.equal(c.inputData, "this is the request body");
  },
  
  "should call get on store" : function() {
    var fakeHttpRequest = new helper.FakeHttpRequest();    
    var fakeStore = new helper.FakeStore();
    var fakeHttpResponse = new helper.FakeHttpResponse();    
    fakeHttpRequest.method = "GET";
    fakeHttpRequest.url = "/name";
    fakeStore.shouldReturn = {"value" : "mike"};
    var c = new abramo.Connection(fakeStore, fakeHttpRequest, fakeHttpResponse);
    fakeHttpRequest.emit("end");
    assert.ok(fakeStore.getCalled);
    assert.equal(fakeStore.getReceivedWith, "/name");
  },
  
  "should call del on store" : function() {
    var fakeHttpRequest = new helper.FakeHttpRequest();    
    var fakeStore = new helper.FakeStore();
    var fakeHttpResponse = new helper.FakeHttpResponse();    
    fakeHttpRequest.method = "DELETE";
    fakeHttpRequest.url = "/name";
    fakeStore.shouldReturn = {"value" : "mike"};
    var c = new abramo.Connection(fakeStore, fakeHttpRequest, fakeHttpResponse);
    fakeHttpRequest.emit("end");
    assert.ok(fakeStore.delCalled);
    assert.equal(fakeStore.delReceivedWith, "/name");
  },
  
  "should not call del on store if path is not found" : function() {
    var fakeHttpRequest = new helper.FakeHttpRequest();    
    var fakeStore = new helper.FakeStore();
    var fakeHttpResponse = new helper.FakeHttpResponse();    
    fakeHttpRequest.method = "DELETE";
    fakeHttpRequest.url = "/name";
    fakeStore.shouldReturn = undefined;
    var c = new abramo.Connection(fakeStore, fakeHttpRequest, fakeHttpResponse);
    fakeHttpRequest.emit("end");
    assert.ok(!fakeStore.delCalled);
  }
}).run();