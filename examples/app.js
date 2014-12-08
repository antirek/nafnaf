
var Asterisk = require('../index');
var Trunk = require('./Trunk');

var configurator = new Asterisk.Configurator('/etc/asterisk');

configurator.loadFiles(general);


function general(){
  var p = configurator.files['sip.conf'].general;
  console.log(p);
  if(p){
    if(p.transport == 'udp'){
      console.log('transport udp true');
    }
    if(Array.isArray(p.register)){
      console.log('sip.conf [general] contain register, count:', p.register.length);
    }
  }

  configurator.saveFile('users.conf', function(err) {
    if(err) console.log(err);
    console.log('good');
  });

  var re = new Trunk(configurator, {name: 'Vasya', secret: '1234', hassip: 'yes', lopata: '12'});
  re.save(function(){
    console.log('hello!!!!!!!!!!!');
  })

};
