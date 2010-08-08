var sys         = require('sys'),
    http        = require('http'),
    storeDebug  = require('./store_debug')
    url         = require('url');
    
var Store = exports.Store = function() {
  this.data = {
    "/" : { 
      value : null,
      info : {        
        started_at : new Date()
      },
      children : {}
    } 
  };
};

Store.prototype.get = function(path) {
  var pointer = this.data["/"];  
  this.eachKey(path, function(key) {        
    pointer = pointer.children[key];
    if (!pointer) {
      pointer = undefined;
      return null;
    };
  });
  return pointer;
};

Store.prototype.set = function(path, value) {
  var pointer = this.data["/"];
  var currentPath = "";
  this.eachKey(path, function(key) {
    currentPath += "/" + key;
    if (!pointer.children[key]) {
      pointer.children[key] = { value: null, children: {} };
      pointer.children[key].info  = {
        path: currentPath,
        last_update_at: new Date()
      };
    }      
    pointer = pointer.children[key];
  });
  pointer.value = value;  
};

Store.prototype.del = function(path) {
};

Store.prototype.eachKey = function(path, callback) {
  var keys = path.split("/");
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key.length > 0) {
      var result = callback(key);
      if (result === null) break;
    }
  }
};

Store.prototype.dump = function(message) {
  return sys.inspect(this.data);
};