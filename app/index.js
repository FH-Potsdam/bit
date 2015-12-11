'use strict';

var _johnnyFive = require('johnny-five');

var five = _interopRequireWildcard(_johnnyFive);

var _mqtt = require('mqtt');

var mqtt = _interopRequireWildcard(_mqtt);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Particle = require('particle-io');
var config = require('simpler-config').load({
  login: require('../config/private.json')
  // ,
  // maybe later we use some more config files
  // patch: require('../model/patch.json')
});
// for easier usage we store some settings in an object
var settings = {
  'client': {
    clientId: 'proto-bit'
  }
};
// Build the URL
var url = 'mqtt://' + config.login.user + ':' + config.login.pw + '@broker.shiftr.io';
// setup the client
var client = mqtt.connect(url, settings.client);

client.on('connect', function () {
  // setup the Photon
  var board = new five.Board({
    io: new Particle({
      token: config.login.token,
      deviceId: config.login.id
    })
  });

  client.subscribe('/input/' + settings.client.clientId);
  board.on('ready', function () {
    client.on('message', function (topic, message) {
      console.log('Client: ' + settings.client.clientId + ' received on topic: ' + topic + ' the message:' + message.toString());
    });
  });
});