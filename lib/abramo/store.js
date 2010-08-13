var sys         = require('sys'),
    http        = require('http'),
    debug       = require('./debug')
    url         = require('url');
    
var Store = exports.Store = function(data) {
  if (data && data instanceof Object) {
    this.data = data;
    this.data["/"].info.started_at = new Date();
  } else {
    this.data = {
      "/" : { 
        value : null,
        info : {        
          started_at : new Date()
        },
        children : {}
      } 
    };
  }  
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
  return currentPath;
};

Store.prototype.del = function(path) {
  var pointer = this.data["/"];
  var parent  = this.data["/"];
  var lastKey = null;
  this.eachKey(path, function(key) {
    parent  = pointer;
    pointer = pointer.children[key];    
    lastKey = key;
    if (!pointer) {
      pointer = undefined;
      return null;
    }
  });
  if (pointer) {
    pointer == parent ?
      pointer.value = null :
        delete(parent.children[lastKey]);
  }
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

Store.prototype.toJSON = function(message) {
  return JSON.stringify(this.data);
};
