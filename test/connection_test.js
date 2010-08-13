var abramo      = require('../lib/abramo'),
    vows        = require('vows'),
    assert      = require('assert'),    
    events      = require('events'),
    helper      = require('./test_helper');


vows.describe('Response').addBatch({
  "should save data if http method is PUT" : function() {
    var fakeHttpRequest = new helper.FakeHttpRequest();
    var store = new abramo.Store();
    var fakeHttpResponse = new helper.FakeHttpResponse();
    fakeHttpRequest.method = "PUT";
    fakeHttpRequest.url = "/path/";
    var c = new abramo.Connection({}, store, fakeHttpRequest, fakeHttpResponse);
    fakeHttpRequest.emit("data", '{"body":"this is ');
    fakeHttpRequest.emit("data", 'the request body"}');
    fakeHttpRequest.emit("end");
    assert.equal(c.inputData, '{"body":"this is the request body"}');
    assert.equal(fakeHttpResponse.status, 201);
    assert.deepEqual(fakeHttpResponse.headers, {"Content-Type" : "application/json", "Location" : "/path"});
  },
  
  "should call get on store" : function() {
    var fakeHttpRequest = new helper.FakeHttpRequest();    
    var fakeStore = new helper.FakeStore();
    var fakeHttpResponse = new helper.FakeHttpResponse();    
    fakeHttpRequest.method = "GET";
    fakeHttpRequest.url = "/name";
    fakeStore.shouldReturn = {"value" : "mike"};
    var c = new abramo.Connection({}, fakeStore, fakeHttpRequest, fakeHttpResponse);
    fakeHttpRequest.emit("end");
    assert.ok(fakeStore.getCalled);
    assert.equal(fakeStore.getReceivedWith, "/name");
    assert.equal(fakeHttpResponse.status, 200);
    assert.deepEqual(fakeHttpResponse.headers, {"Content-Type" : "application/json"});
  },
  
  "should call del on store" : function() {
    var fakeHttpRequest = new helper.FakeHttpRequest();    
    var fakeStore = new helper.FakeStore();
    var fakeHttpResponse = new helper.FakeHttpResponse();    
    fakeHttpRequest.method = "DELETE";
    fakeHttpRequest.url = "/name";
    fakeStore.shouldReturn = {"value" : "mike"};
    var c = new abramo.Connection({}, fakeStore, fakeHttpRequest, fakeHttpResponse);
    fakeHttpRequest.emit("end");
    assert.ok(fakeStore.delCalled);
    assert.equal(fakeStore.delReceivedWith, "/name");
    assert.equal(fakeHttpResponse.status, 200);
    assert.deepEqual(fakeHttpResponse.headers, {"Content-Type" : "application/json"});
  },
  
  "should not call del on store if path is not found" : function() {
    var fakeHttpRequest = new helper.FakeHttpRequest();    
    var fakeStore = new helper.FakeStore();
    var fakeHttpResponse = new helper.FakeHttpResponse();    
    fakeHttpRequest.method = "DELETE";
    fakeHttpRequest.url = "/name";
    fakeStore.shouldReturn = undefined;
    var c = new abramo.Connection({}, fakeStore, fakeHttpRequest, fakeHttpResponse);
    fakeHttpRequest.emit("end");
    assert.ok(!fakeStore.delCalled);
    assert.equal(fakeHttpResponse.status, 404);
    assert.deepEqual(fakeHttpResponse.headers, {"Content-Type" : "application/json"});
  },
  
  "should recognize command" : function() {
    var fakeHttpRequest = new helper.FakeHttpRequest();    
    var fakeStore = new helper.FakeStore();
    var fakeHttpResponse = new helper.FakeHttpResponse();
    fakeHttpRequest.url = "/_/this/is/a / command";
    var c = new abramo.Connection({}, fakeStore, fakeHttpRequest, fakeHttpResponse);
    assert.equal(c.command, "this/is/a / command");
  },
  
  "should send 501 status code if command is not implemented" : function() {
    var fakeHttpRequest = new helper.FakeHttpRequest();    
    var fakeStore = new helper.FakeStore();
    var fakeHttpResponse = new helper.FakeHttpResponse();
    fakeHttpRequest.url = "/_/this/is/a/bad/command";
    var c = new abramo.Connection({}, fakeStore, fakeHttpRequest, fakeHttpResponse);
    fakeHttpRequest.emit("end");
    assert.equal(fakeHttpResponse.status, 501);
  },
  
  "should not save value on commands path" : function() {
    var fakeHttpRequest = new helper.FakeHttpRequest();    
    var fakeStore = new helper.FakeStore();
    var fakeHttpResponse = new helper.FakeHttpResponse();
    fakeHttpRequest.url = "/_/path";
    fakeHttpRequest.method = "PUT";
    var c = new abramo.Connection({}, fakeStore, fakeHttpRequest, fakeHttpResponse);
    fakeHttpRequest.emit("data", "{}");
    fakeHttpRequest.emit("end");
    assert.equal(fakeHttpResponse.status, 400);
  }
}).run();