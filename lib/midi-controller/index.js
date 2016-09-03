'use strict';

const midi = require('midi');

function MidiController() {
  this.input = new midi.input();
  this.noteListeners = [];
  this.ccListeners = [];
}

MidiController.prototype.connect = function(portName) {
  const ports = getPorts(this.input);
  if (!ports.has(portName)) {
    throw new Error(`Cannot connect to MIDI port "${portName}"`);
  }

  this.input.openPort(ports.get(portName));

  this.input.on('message', (deltaTime, message) => {
    handleMessage(this.input, message, this.noteListeners, this.ccListeners);
  });
};

MidiController.prototype.disconnect = function() {
  this.input.closePort();
};

/**
 * @param {function} listener (pitch, velocity)
 * @return {function} a function to remove the listener
 */
MidiController.prototype.onNote = function(listener) {
  this.noteListeners.push(listener);

  return () => {
    this.noteListeners = this.noteListeners.filter((l) => l !== listener);
  };
};

/**
 * @param {function} listener (number, value)
 * @return {function} a function to remove the listener
 */
MidiController.prototype.onCC = function(listener) {
  this.ccListeners.push(listener);

  return () => {
    this.ccListeners = this.ccListeners.filter((l) => l !== listener);
  };
}

module.exports = MidiController;

// Helper functions

function getPorts(input) {
  const portMap = new Map();

  const portCount = input.getPortCount();
  for (let portIndex = 0; portIndex < portCount; portIndex++) {
    const portName = input.getPortName(portIndex);
    portMap.set(portName, portIndex);
  }

  return portMap;
}

function handleMessage(input, message, noteListeners, ccListeners) {
  // console.log('message', message);

  // TODO handle midi channels according to specs
  // See: https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html
  if (message[0] === 159) {
    noteMessage(message[1], message[2], noteListeners);
  } else if (message[0] === 143) {
    noteMessage(message[1], 0, noteListeners);
  } else if (message[0] === 185) {
    // CC
    ccMessage(message[1], message[2], ccListeners);
  }
}

function noteMessage(pitch, velocity, noteListeners) {
  noteListeners.forEach(listener => listener(pitch, velocity));
}

function ccMessage(number, value, ccListeners) {
  ccListeners.forEach(listener => listener(number, value));
}
