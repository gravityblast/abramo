var StoreServerResponse = exports.StoreServerResponse = function(response) {
  this.response = response;
  this.status   = undefined;
  this.location = undefined;
  this.body     = {};
};

StoreServerResponse.prototype.end = function() {
  var headers = {
    "Content-Type" : "application/json"
  };
  if (this.location !== undefined) headers["Location"] = this.location;
  this.response.writeHead(this.status, headers);
  this.response.write(this.createResponseBody());
  this.response.end();
};

StoreServerResponse.prototype.createResponseBody = function() {
  this.body.status = this.status;
  return JSON.stringify(this.body) + "\n";
};