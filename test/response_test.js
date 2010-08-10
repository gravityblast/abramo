var vows      = require('vows'),
    assert    = require('assert'),
    response  = require('../lib/abramo/response');

FakeHttpResponse = function() {
  this.status   = null;
  this.headers  = null;
  this.body     = "";
};

FakeHttpResponse.prototype.writeHead = function(status, headers) {
  this.status   = status;
  this.headers  = headers;
};

FakeHttpResponse.prototype.write = function(data) {
  this.body += data;
};

FakeHttpResponse.prototype.end = function() {
  this.endCalled = true;
};

vows.describe('Response').addBatch({
  "should set the status code" : function() {
    var fakeHttpResponse = new FakeHttpResponse();
    var r = new response.Response(fakeHttpResponse);
    r.status = 200;
    r.end(); 
    assert.equal(fakeHttpResponse.status, 200);
  },
  
  "should write headers" : function() {
    var fakeHttpResponse = new FakeHttpResponse();
    var r = new response.Response(fakeHttpResponse);
    r.location = '/path/';
    r.end(); 
    assert.deepEqual(fakeHttpResponse.headers, {
      "Location"      : "/path/",
      "Content-Type"  : "application/json"
    });
  },

  "should send response body" : function() {
    var fakeHttpResponse = new FakeHttpResponse();
    var r = new response.Response(fakeHttpResponse);
    r.body.value = {name: "mike"};
    r.end();
    assert.equal(fakeHttpResponse.body, r.createResponseBody());
  },
  
  "should create JSON body" : function() {
    var fakeHttpResponse = new FakeHttpResponse();
    var r = new response.Response(fakeHttpResponse);
    r.body.value = {name: "mike"};
    assert.equal(r.createResponseBody(), '{"value":{"name":"mike"}}\n');
  }
}).run();