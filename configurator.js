
var D = require('dialplan'),
    astconf = require('astconf'),
    fs = require('fs'),
    dir = require('node-dir'),
    path = require('path');


var Configurator = function(dirname){
  this.conffiles = {};
  this.dialplan = D;
  this.dirname = dirname;
};


Configurator.prototype.loadConfFiles = function (callback) {
  if (this.dirname) {
    var that = this;

    dir.readFiles(
      that.dirname, {
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
        if (err) throw err;
        if(callback){
          callback();
        }
      }
    );
  }
};


Configurator.prototype.saveConfFile = function (filename, callback) {
  if (this.conffiles[filename]) {
    fs.writeFile(
      path.resolve(this.dirname, filename), 
      astconf.stringify(this.conffiles[filename]), 
      callback
    );
  } else {
    callback(new Error('No filename'));
  }
};

module.exports = Configurator;