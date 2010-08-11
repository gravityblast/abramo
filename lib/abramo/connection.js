var debug     = require('./debug'),
    response  = require('./response'),
    sys       = require('sys'),
    url       = require('url');

var Connection = exports.Connection = function(store, httpRequest, httpResponse) {
  this.store                = store;
  this.httpRequest          = httpRequest;
  this.httpResponse         = httpResponse;
  this.inputData            = "";
  this.method               = httpRequest.method;
  var _url                  = url.parse(httpRequest.url, true);
  this.path                 = _url.pathname;
  this.options              = _url.query || {};
  this.response             = new response.Response(httpResponse);
  this.httpRequest.on("data", this.dataListener.bind(this));
  this.httpRequest.on("end",  this.endListener.bind(this));  
};

Connection.prototype.dataListener = function(chunk) {
  if (this.method == 'PUT') {
    this.inputData += chunk;
  }
};

Connection.prototype.endListener = function() {  
  var method = "handle" + this.method + "Request";
  if (this[method]) {
    this[method]();
  }
  debug.debug(this.method + ": " + this.path + " " + this.response.status);
  this.response.end();
};

Connection.prototype.handleGETRequest = function() {  
  var value = this.store.get(this.path);
  if (value !== undefined) {
    this.response.status = 200;
    this.response.body.value   = value.value;
    this.response.body.info    = value.info;
    if (this.options.include_children == 'true') {
      this.response.body.children  = value.children;
    }
  } else {
    this.response.status = 404;
  }
};

Connection.prototype.handlePUTRequest = function() {  
  try {
    var value = JSON.parse(this.inputData);
    this.store.set(this.path, value);
    this.response.status   = 201;
    this.response.location = this.path;
  } catch (err) {    
    this.response.status   = 400;
    this.response.body.message  = "Invalid JSON"
  }
};

Connection.prototype.handleDELETERequest = function() {    
  if (this.store.get(this.path) !== undefined) {
    this.store.del(this.path);
    this.response.status = 200;    
  } else {
    this.response.status = 404;
  }
};
