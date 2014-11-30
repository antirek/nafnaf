'use strict';

var aio = require('asterisk.io'),
    D = require('dialplan'),
    astconf = require('astconf'),
    fs = require('fs'),
    dir = require('node-dir'),
    path = require('path');

var Asterisk = function(confObj, callback){
  this.ini = {};
  this.ami = null;
  this.agi = null;
  this.dialplan = D;

  if(confObj.ami){
    this.initAmi(confObj.ami);
  }

  if(confObj.ini){
    this.loadConfFiles(confObj.ini, callback);
  }
}

Asterisk.prototype.initAmi = function (conf) {
  this.ami = aio.ami(
    conf.host || 'localhost',
    conf.port || '5038',
    conf.username || 'admin',
    conf.password || 'password'
  );
}

Asterisk.prototype.loadConfFiles = function (dirname, callback) {
  var that = this;
  dir.readFiles(dirname, {
      encoding: 'utf-8',
      match: /.conf$/,
      recursive: false,
      exclude: /^\./
    }, function (err, content, filename, next) {
      if (err) throw err;
      filename = path.basename(filename);
      that.ini[filename] = astconf.parse(content);
      next();
    }, function (err, files) {
      if (err) callback(err);
      callback(null); 
    }
  );
}

module.exports = Asterisk;