exports.Server      = require('./abramo/server').Server;
exports.Store       = require('./abramo/store').Store;
exports.Connection  = require('./abramo/connection').Connection;
exports.Response    = require('./abramo/response').Response;
exports.debug       = require('./abramo/debug');

var sys = require('sys'),
    fs  = require('fs');

var Abramo = exports.Abramo = function(configFilePath) {
  this.loadConfig(configFilePath);
};

Abramo.prototype.loadConfig = function(configFilePath) {
  fs.readFile(configFilePath, function(err, data) {
    if (err) {
      sys.puts(err);
      process.exit(1);
    }    
    this.config = this.parseConfig(data);
    this.start();
  }.bind(this));
};

Abramo.prototype.parseConfig = function(data) {
  try {
    return JSON.parse(data);
  } catch(err) {
    sys.puts("Configuration file should contain valid JSON");
    process.exit(1);
  }
};

Abramo.prototype.start = function() {  
  var s = new exports.Server(this.config);
  s.listen();
};