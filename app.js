var Asterisk = require('./index');
var ini = require('astconf');
var fs = require('fs');

var asterisk = new Asterisk({
  ami: {
    host: 'localhost',
    port: '5038',
    username: 'admin',
    password: 'superpassword'
  },
  ini: '/etc/asterisk',
  }, function (err) {
    if(err) throw err;
    console.log(asterisk);
    general();
  });

asterisk.ami.on('ready', function () {
    console.log('ready');
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

  var q = ini.stringify(p2);
  console.log(q);


  asterisk.saveConfFile('users.conf', function(err){
    if(err) console.log(err);
    console.log('good');
  });


};


var user = {
  secret: 1234,
  host: 'dynamic',
  fullname: 'New User',
  userbase: 6000,
  hasvoicemail: 'yes',
  vmsecret: 1234,
  hassip: 'yes'
}