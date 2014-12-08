'use strict';

var aio = require('asterisk.io'),
    configurator = require('./configurator');


module.exports = {
  Configurator: configurator,
  AMI: aio.ami,
  AGI: aio.agi
};