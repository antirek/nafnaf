
var Asterisk = require('./index');
var ini = require('astconf');
var ConfTemplate = require('astconf-template');
var Trunk = require('./Trunk');

var asterisk = new Asterisk.Configurator('/etc/asterisk');

asterisk.loadConfFiles(general);


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

  var p2 = asterisk.conffiles['users.conf'];

  var q = ini.stringify(p2);
  console.log(q);

  asterisk.saveConfFile('users.conf', function(err) {
    if(err) console.log(err);
    console.log('good');
  });

  var re = new Trunk(asterisk, {name: 'Vasya', secret: '1234', hassip: 'yes', lopata: '12'});
  re.save(function(){
    console.log('hello!!!!!!!!!!!');
  })

};
