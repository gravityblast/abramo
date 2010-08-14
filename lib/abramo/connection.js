var debug     = require('./debug'),
    response  = require('./response'),
    sys       = require('sys'),
    url       = require('url'),
    _command  = require('./command');

var Connection = exports.Connection = function(config, store, httpRequest, httpResponse) {
  this.config               = config;
  this.store                = store;
  this.httpRequest          = httpRequest;
  this.httpResponse         = httpResponse;
  this.inputData            = "";
  this.method               = httpRequest.method;
  var _url                  = url.parse(httpRequest.url, true);
  this.path                 = _url.pathname;
  this.options              = _url.query || {};
  this.command              = this.checkCommandFromPath(this.path);
  this.response             = new response.Response(httpResponse);
  this.httpRequest.on("data", this.dataListener.bind(this));
  this.httpRequest.on("end",  this.endListener.bind(this));
};

Connection.prototype.checkCommandFromPath = function(path) {
  var matches = path.match(/^\/_\/(.+)/);
  return matches ? matches[1] : null;
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
};

Connection.prototype.handleGETRequest = function() {
  if (this.command) {
    this.executeCommand(this.command);
    return;
  }
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
  this.response.end();
};

Connection.prototype.handlePUTRequest = function() {
  if (this.command) {
    this.sendInvalidPathMessage();
    return;
  }
  try {    
    var value = JSON.parse(this.inputData);
    var path = this.store.set(this.path, value);
    this.response.status   = 201;
    this.response.location = path;
  } catch (err) {
    this.response.status   = 400;
    this.response.body.message  = "Invalid JSON";
  }
  this.response.end();
};

Connection.prototype.handleDELETERequest = function() {
  if (this.command) {
    this.sendInvalidPathMessage();
    return;
  }
  if (this.store.get(this.path) !== undefined) {
    this.store.del(this.path);
    this.response.status = 200;    
  } else {
    this.response.status = 404;
  }
  this.response.end();
};

Connection.prototype.sendInvalidPathMessage = function() {
  this.response.status   = 400;
  this.response.body.message  = "Invalid path. /_/ is used for internal commands";
  this.response.end();
}

Connection.prototype.executeCommand = function(command) { 
  var c = new _command.Command(this.config, this.store, this.commandHandler.bind(this));  
  if (c.hasCommand(command))  {
    this.response.status = 200;
    c.execute(command);
  } else {
    this.response.status = 501;
    this.response.body.message  = "Command not implemented";
    this.response.end();
  }
}

Connection.prototype.commandHandler = function(err, message) {  
  this.response.body.message = err ? err : message;
  this.response.end();
};