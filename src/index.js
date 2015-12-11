import * as five from 'johnny-five';
import * as mqtt from 'mqtt';
let Particle = require('particle-io');
var config = require('simpler-config').load({
  login: require('../config/private.json')
  // ,
  // maybe later we use some more config files
  // patch: require('../model/patch.json')
});
// for easier usage we store some settings in an object
let settings = {
  'client': {
  clientId: 'proto-bit'
  }
};
// Build the URL
let url = `mqtt://${config.login.user}:${config.login.pw}@broker.shiftr.io`;
// setup the client
let client = mqtt.connect(url, settings.client);

client.on('connect', ()=>{
  // setup the Photon
  let board = new five.Board({
    io: new Particle({
      token:config.login.token,
      deviceId:config.login.id
    })
  });

client.subscribe(`/input/${settings.client.clientId}`);
board.on('ready', ()=>{
  client.on('message',(topic, message)=>{
    console.log(`Client: ${settings.client.clientId} received on topic: ${topic} the message:${message.toString()}`);
  });

});

});