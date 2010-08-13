var dumper  = require('./dumper'),
    debug   = require('./debug');

var commands = {
  "dump" : "dump"
};

var Command = exports.Command = function(config, store, startCallback) {  
  this.config         = config;
  this.store          = store;
  this.startCallback  = startCallback;
};

Command.prototype.hasCommand = function(command) {
  return commands[command] !== undefined;
};

Command.prototype.execute = function(command) {
  var commandName = commands[command];  
  if (commandName) {    
    this[commandName]();    
    return true;
  } else {
    return false;
  }
};

Command.prototype.dump = function() {
  var d = new dumper.Dumper(this.config, this.store);  
  d.dump(this.commandStartCallback.bind(this), this.commandEndCallback.bind(this));
};

Command.prototype.commandStartCallback = function(err, message) {
  debug.debug(err ? err : message);  
  this.startCallback(err, message);
};

Command.prototype.commandEndCallback = function(err, message) {
  debug.debug(err ? err : message);
};