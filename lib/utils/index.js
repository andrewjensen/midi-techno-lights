'use strict';

const inquirer = require('inquirer');
const midi = require('midi');

const Utils = {};

module.exports = Utils;

Utils.chooseMidiInputDevice = function() {
  const ports = Utils.getMidiInputPorts(new midi.input());
  const portChoices = [];
  for (let portName of ports.keys()) {
    portChoices.push(portName);
  }

  const portQuestion = {
    type: 'list',
    name: 'port',
    message: 'Which MIDI input port would you like to use?',
    choices: portChoices
  };

  return inquirer.prompt([portQuestion])
    .then(answers => answers.port);
}


Utils.getMidiInputPorts = function(input) {
  const portMap = new Map();

  const portCount = input.getPortCount();
  for (let portIndex = 0; portIndex < portCount; portIndex++) {
    const portName = input.getPortName(portIndex);
    portMap.set(portName, portIndex);
  }

  return portMap;
}
