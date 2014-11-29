var Asterisk = require('./index');

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
  console.log(asterisk.ini['sip.conf'].general);
}