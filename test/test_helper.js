var events  = require('events');

// Fake Store

var FakeStore = exports.FakeStore = function() {
  
}

FakeStore.prototype.get = function(key) {
  this.getCalled = true;
  this.getReceivedWith = key;
  return this.shouldReturn;
}

FakeStore.prototype.del = function(key) {
  this.delCalled = true;
  this.delReceivedWith = key;
  return this.shouldReturn;
}

// FakeHttpRequest

var FakeHttpRequest = exports.FakeHttpRequest = function() {
  this.eventEmitter = new events.EventEmitter();
  this.method = "GET";
  this.url = "/";  
};

FakeHttpRequest.prototype.emit = function(event) {
  this.eventEmitter.emit.apply(this.eventEmitter, arguments);
};

FakeHttpRequest.prototype.on = function(event, callback) {
  this.eventEmitter.on(event, callback);
};

// FakeHttpResponse

FakeHttpResponse = exports.FakeHttpResponse = function() {
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