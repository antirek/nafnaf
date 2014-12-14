
var D = require('dialplan'),
    astconf = require('astconf'),
    astconf_template = require('astconf-template')
    fs = require('fs'),
    dir = require('node-dir'),
    path = require('path');


var Configurator = function (dirname) {
  this.files = {};
  this.dialplan = D;
  this.dirname = dirname;
  this.template = astconf_template;
};


Configurator.prototype.loadFiles = function (callback) {
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
        that.files[filename] = astconf.parse(content);
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


Configurator.prototype.saveFile = function (filename, callback) {
  if (this.files[filename]) {
    fs.writeFile(
      path.resolve(this.dirname, filename), 
      astconf.stringify(this.files[filename]), 
      callback
    );
  } else {
    callback(new Error('No filename'));
  }
};


module.exports = Configurator;