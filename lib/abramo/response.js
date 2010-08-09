var Response = exports.Response = function(httpResponse) {
  this.httpResponse = httpResponse;
  this.status   = undefined;
  this.location = undefined;
  this.body     = {};
};

Response.prototype.end = function() {
  var headers = {
    "Content-Type" : "application/json"
  };
  if (this.location !== undefined) headers["Location"] = this.location;
  this.httpResponse.writeHead(this.status, headers);
  this.httpResponse.write(this.createResponseBody());
  this.httpResponse.end();
};

Response.prototype.createResponseBody = function() {
  this.body.status = this.status;
  return JSON.stringify(this.body) + "\n";
};