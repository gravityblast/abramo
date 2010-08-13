var store       = require('./store'),
    debug       = require('./debug'),
    connection  = require('./connection'),
    http        = require('http');

var Server = exports.Server = function(config, store) {
  this.config     = config;
  this.store      = store;
  this.httpServer = http.createServer(this.requestListener.bind(this));
};

Server.prototype.listen = function() {
  this.httpServer.listen(this.config.port, this.config.address, function() {
    debug.debug("Abramo starting on http://" + this.config.address + ":" + this.config.port);
  }.bind(this));
};

Server.prototype.requestListener = function(request, response) {  
  new connection.Connection(this.config, this.store, request, response);
};