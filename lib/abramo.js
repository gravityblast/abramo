exports.Server      = require('./abramo/server').Server;
exports.Store       = require('./abramo/store').Store;
exports.Connection  = require('./abramo/connection').Connection;
exports.Response    = require('./abramo/response').Response;
exports.Command     = require('./abramo/command');
exports.Dumper      = require('./abramo/Dumper');
var debug = exports.debug = require('./abramo/debug');

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
    this.initializeStore();
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

Abramo.prototype.initializeStore = function() {
  this.store = new exports.Store();
  if (this.config.dump_file !== undefined) {
    this.loadOrCreateDumpFile();
  } else {
    this.store = new exports.Store();
    this.start();
  }
};

Abramo.prototype.loadOrCreateDumpFile = function() {
  fs.stat(this.config.dump_file, this.dumpFileStatHandler.bind(this));
};

Abramo.prototype.dumpFileStatHandler = function(err, stats) {
  if (err) {
    this.store = new exports.Store();
    this.start();
  } else if (stats.isFile()) {
      this.loadDumpFile();
  } else {
    sys.puts("dump_file is not a file.");
    process.exit(1);
  }
};

Abramo.prototype.loadDumpFile = function() {
  fs.readFile(this.config.dump_file, function(err, data) {
    if (err) {
      sys.puts(err);
      process.exit(1);
    }
    try {
      debug.debug("loading " + this.config.dump_file);
      this.store = new exports.Store(JSON.parse(data));
      this.start();
    } catch (err) {
      sys.puts("Error loading dump file: " + err)
      process.exit();
    }
  }.bind(this));
};

Abramo.prototype.start = function() {  
  var s = new exports.Server(this.config, this.store);
  s.listen();
};