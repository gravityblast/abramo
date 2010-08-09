var store       = require('./store'),
    debug       = require('./debug'),
    connection  = require('./connection'),
    http        = require('http');

var Server = exports.Server = function() {
  this.store = new store.Store();
  this.httpServer = http.createServer(this.requestListener.bind(this));
};

Server.prototype.listen = function(port, address) {
  var port    = arguments[0] || 8000;
  var address = arguments[1] || '127.0.0.1';
  this.httpServer.listen(port, address, function() {
    debug.debug("Abramo starting on http://" + address + ":" + port);
  });
};

Server.prototype.requestListener = function(request, response) {  
  new connection.Connection(this.store, request, response);
};