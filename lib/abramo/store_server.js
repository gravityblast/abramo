var store       = require('./store'),
    storeDebug  = require('./store_debug'),
    storeServerConnection = require('./store_server_connection'),
    http        = require('http');

var StoreServer = exports.StoreServer = function() {
  this.store = new store.Store();
  this.httpServer = http.createServer(this.requestListener.bind(this));
};

StoreServer.prototype.listen = function(port, address) {
  var port    = arguments[0] || 8000;
  var address = arguments[1] || '127.0.0.1';
  this.httpServer.listen(port, address, function() {
    storeDebug.debug("Abramo starting on http://" + address + ":" + port);
  });
};

StoreServer.prototype.requestListener = function(request, response) {  
  new storeServerConnection.StoreServerConnection(this.store, request, response);
};