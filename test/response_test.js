var abramo    = require('../lib/abramo'),
    vows      = require('vows'),
    assert    = require('assert'),    
    helper    = require('./test_helper');

vows.describe('Response').addBatch({
  "should set the status code" : function() {
    var fakeHttpResponse = new helper.FakeHttpResponse();
    var r = new abramo.Response(fakeHttpResponse);
    r.status = 200;
    r.end(); 
    assert.equal(fakeHttpResponse.status, 200);
  },
  
  "should write headers" : function() {
    var fakeHttpResponse = new helper.FakeHttpResponse();
    var r = new abramo.Response(fakeHttpResponse);
    r.location = '/path/';
    r.end(); 
    assert.deepEqual(fakeHttpResponse.headers, {
      "Location"      : "/path/",
      "Content-Type"  : "application/json"
    });
  },

  "should send response body" : function() {
    var fakeHttpResponse = new helper.FakeHttpResponse();
    var r = new abramo.Response(fakeHttpResponse);
    r.body.value = {name: "mike"};
    r.end();
    assert.equal(fakeHttpResponse.body, r.createResponseBody());
  },
  
  "should create JSON body" : function() {
    var fakeHttpResponse = new helper.FakeHttpResponse();
    var r = new abramo.Response(fakeHttpResponse);
    r.body.value = {name: "mike"};
    assert.equal(r.createResponseBody(), '{"value":{"name":"mike"}}\n');
  },
  
  "should call end on httpResponse" : function() {
    var fakeHttpResponse = new helper.FakeHttpResponse();
    var r = new abramo.Response(fakeHttpResponse);
    assert.ok(!fakeHttpResponse.endCalled);
    r.end();
    assert.ok(fakeHttpResponse.endCalled);
  }
}).run();
