var sys = require('sys');

exports.options = {
  enable : true
};

exports.debug = function(message) {
  if (this.options.enable) {
    sys.puts(message);
  }  
};