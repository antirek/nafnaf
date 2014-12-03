'use strict';


var aio = require('asterisk.io'),
    D = require('dialplan'),
    astconf = require('astconf'),
    fs = require('fs'),
    dir = require('node-dir'),
    path = require('path');


var Asterisk = function(configObj){
  this.conffiles = {};
  this.ami = null;
  this.agi = null;
  this.dialplan = D;
  this.config = {};

  if(configObj.ami){
    this.initAmi(configObj.ami);
  }

  if(configObj.ini){
    this.loadConfFiles(configObj.ini);
  }
}


Asterisk.prototype.initAmi = function (conf) {
  this.config['ami'] = conf;

  this.ami = aio.ami(
    conf.host || 'localhost',
    conf.port || '5038',
    conf.username || 'admin',
    conf.password || 'password'
  );
}


Asterisk.prototype.loadConfFiles = function (conf) {
  if (conf.dirname) {
    this.config['dirname'] = conf.dirname;
    var that = this;

    dir.readFiles(
      conf.dirname, {
        encoding: 'utf-8',
        match: /.conf$/,
        recursive: false,
        exclude: /^\./
      }, function (err, content, filename, next) {
        if (err) throw err;
        filename = path.basename(filename);
        that.conffiles[filename] = astconf.parse(content);
        next();
      }, function (err) {
        console.log(conf.callback);
        console.log(err);
        if(conf.callback){
          conf.callback();
        }
      }
    );
  }
}


Asterisk.prototype.saveConfFile = function (filename, callback) {
  if (this.conffiles[filename]) {
    fs.writeFile(
      path.resolve(this.config['dirname'], filename), 
      astconf.stringify(this.conffiles[filename]), 
      callback
    );
  } else {
    callback(new Error('No filename in asterisk.ini object'));
  }
}


module.exports = Asterisk;