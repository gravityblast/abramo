#!/usr/bin/env node

var sys     = require('sys'),
    abramo  = require('../lib/abramo');

var server = new abramo.Server();
server.listen(8000);