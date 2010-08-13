var sys = require('sys'),
    fs  = require('fs');
    
var Dumper = exports.Dumper = function(config, store) {
  this.config = config;
  this.store  = store;
};

Dumper.prototype.dump = function(startCallback, endCallback) {  
  fs.open(this.config.dump_file, "w", 0666, function(err, fd) {    
    if (err) {
      startCallback(err, null);
    } else {
      startCallback(null, "Dump started");
      fs.write(fd, this.store.toJSON());
      endCallback(null, "Dump finished");
    }    
  }.bind(this));
};