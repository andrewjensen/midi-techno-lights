'use strict';

const midi = require('midi');
const utils = require('../utils');

function MidiController() {
  this.input = new midi.input();
  this.noteListeners = [];
  this.ccListeners = [];
}

MidiController.prototype.connect = function(portName) {
  const ports = utils.getMidiInputPorts(this.input);
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


function handleMessage(input, message, noteListeners, ccListeners) {
  // console.log('message', message);

  // TODO handle midi channels according to specs
  // See: https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html
  if (message[0] === 159 || message[0] === 144) {
    noteMessage(message[1], message[2], noteListeners);
  } else if (message[0] === 143 || message[0] === 128) {
    noteMessage(message[1], 0, noteListeners);
  } else if (message[0] === 185 || message[0] === 176) {
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
