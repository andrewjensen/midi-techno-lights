'use strict';

const MidiController = require('./midi-controller');

let controller = null;

module.exports = {
  start: start,
  stop: stop
}


function start(inputDeviceName) {
  controller = new MidiController();

  controller.connect(inputDeviceName);

  controller.onNote((pitch, velocity) => {
    console.log('note!', pitch, velocity);
  });

  controller.onCC((number, value) => {
    console.log('cc!', number, value);
  });
}

function stop() {
  controller.disconnect();
}
