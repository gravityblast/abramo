var abramo = require('../lib/abramo');
    vows   = require('vows'),
    assert = require('assert');    
    
vows.describe('Store').addBatch({
  "should have the root element" : function() {
    var s = new abramo.Store();
    var data = s.data;
    assert.equal(data["/"].data, null);
    assert.ok(data["/"].info.started_at instanceof Date);
  },
  
  "should save data" : function() {
    var s = new abramo.Store();
    s.set("name", "mike");
    var data = s.data;
    assert.equal(data["/"].data, null);
    assert.equal(data["/"].children["name"].data, "mike");
    assert.deepEqual(data["/"].children["name"].children, {});
    assert.equal(data["/"].children["name"].info.path, "/name");
    assert.ok(data["/"].children["name"].info.last_update_at instanceof Date);
  },
  
  "should retrieve data" : function() {
    var s = new abramo.Store();
    s.set("name", "mike");
    var result = s.get("name");
    assert.equal(result.data, "mike");
    assert.equal(result.info.path, "/name");
    assert.deepEqual(result.children, {});
    assert.ok(result.info.last_update_at instanceof Date);    
  } ,
  
  "should save data and create parent if it doesn't exist" : function() {
    var s = new abramo.Store();
    s.set("people/mike", "mike");
    var data = s.data;    
    assert.equal(data["/"].children.people.data, null);
    assert.equal(data["/"].children.people.info.path, "/people");
    assert.ok(data["/"].children.people.info.last_update_at instanceof Date);
    assert.equal(data["/"].children.people.children.mike.data, "mike");
    assert.deepEqual(data["/"].children.people.children.mike.children, {});
    assert.equal(data["/"].children.people.children.mike.info.path, "/people/mike");
    assert.ok(data["/"].children.people.children.mike.info.last_update_at instanceof Date);
  },
  
  "should delete data" : function() {
    var s = new abramo.Store();
    s.set("people/mike", "mike");
    s.set("people", "all");
    s.del("people/mike");
    assert.strictEqual(s.data["/"].children.people.children.mike, undefined);
    assert.deepEqual(s.data["/"].children.people.children, {});
    assert.deepEqual(s.data["/"].children.people.data, "all");
  },
  
  "should set data for the root element" : function() {
    var s = new abramo.Store();
    s.set("/", "mike");
    assert.equal(s.get("/").data, "mike");
  },
  
  "should delete data from the root element" : function() {
    var s = new abramo.Store();
    s.set("/", "mike");
    assert.equal(s.get("/").data, "mike");
    s.del("/");
    assert.strictEqual(s.get("/").data, null);
  }
}).run();