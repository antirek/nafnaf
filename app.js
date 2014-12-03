
var Asterisk = require('./index');
var ini = require('astconf');


var asterisk = new Asterisk({
    ami: {
      host: 'localhost',
      port: '5038',
      username: 'admin',
      password: 'superpassword'
    },
    ini: {
      dirname: '/etc/asterisk',
      callback: general
    }
  });

asterisk.ami.on('ready', function () {
    console.log('ready');
    //general();
  });

asterisk.ami.on('error', function (err) {
    throw err;
});


function general(){
  var p = asterisk.conffiles['sip.conf'].general;
  console.log(p);
  if(p){
    if(p.transport == 'udp'){
      console.log('transport udp true');
    }
    if(Array.isArray(p.register)){
      console.log('sip.conf [general] contain register, count:', p.register.length);
    }
  }
  console.log(ini.encode(p));

  var p2 = asterisk.conffiles['users.conf'];
  p2['vasya'] = user;
  p2['trunk_1'] = trunk;

  var q = ini.stringify(p2);
  console.log(q);

  asterisk.saveConfFile('users.conf', function(err){
    if(err) console.log(err);
    console.log('good');
  });


  appendTrunk('trunk_1', trunk);

};

var appendObjectToUsersConf = function (name, object, callback) {
  var users_conf = asterisk.conffiles['users.conf'];
  users_conf[name] = object;
  asterisk.saveConfFile('users.conf', callback);
};


var appendContextForTrunk = function (name, object){
  var extensions_conf = asterisk.conffiles['extensions.conf'];
  var D = asterisk.dialplan;
  var App = D.Application;
  var context = new D.Context(name + '_trunk');
  console.log('extensions_conf', extensions_conf);
  var extension = new D.Extension('s');
  extension.append(App.Dial('SIP/gate'));
  context.append(extension);
  extensions_conf[name + '_trunk'] = context.getExtensionsContent();
  asterisk.saveConfFile('extensions.conf', function () {
    console.log('extensions_conf updated');
  });
};

var appendTrunk = function (name, object, callback) {
  appendContextForTrunk(name, object);
  appendObjectToUsersConf(name, object, callback);
};




var user = {
  secret: 1234,
  host: 'dynamic',
  fullname: 'New User',
  userbase: 6000,
  hasvoicemail: 'yes',
  vmsecret: 1234,
  hassip: 'yes'
};

var trunk = {
  host: '192.168.123.15',
  username:  'asd',
  secret: 'sad',
  trunkname: 'sad',
  context: 'DID_trunk_1',
  hasexten: 'no',
  hasiax: 'no',
  hassip: 'yes',
  registeriax: 'no',
  registersip: 'yes',
  trunkstyle: 'voip',
  outboundproxy: '12.12.12.12',
  fromdomain: '122.er.ru',
  authuser: '12111',
  insecure: 'no',
  disallow: 'all',
  allow: 'ulaw,alaw,gsm,g726'
};