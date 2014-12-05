
var Asterisk = require('./index');
var ini = require('astconf');
var Conf = require('./app3');

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

  var q = ini.stringify(p2);
  console.log(q);

  asterisk.saveConfFile('users.conf', function(err){
    if(err) console.log(err);
    console.log('good');
  });

  appendTrunk(trunk);

};

var appendObjectToUsersConf = function (object, callback) {
  var users_conf = asterisk.conffiles['users.conf'];
  users_conf[object.name] = object;
  asterisk.saveConfFile('users.conf', callback);
};

var appendContextForTrunk = function (object){

  var extensions_conf = asterisk.conffiles['extensions.conf'];
  var D = asterisk.dialplan;
  var App = D.Application;
  object['context'] = 'trunk-' + object.name;

  var context = new D.Context(object['context']);
  console.log('extensions_conf', extensions_conf);

  context
    .append([
      new D.Extension('s')
        .append(App.Dial('SIP/gate')),
      new D.Include('international_calls')
      ]);

  extensions_conf[object.context] = context.makeObject();
  
  asterisk.saveConfFile('extensions.conf', function () {
    console.log('extensions_conf updated');
  });
};


var appendTrunk = function (object, callback) {
  appendContextForTrunk(object);
  appendObjectToUsersConf(object, callback);
};


var user = new Conf.UserConf({name: 'Vasya', secret: '1234', hassip: 'yes', lopata: '12'});

var trunk = user.attributes;
