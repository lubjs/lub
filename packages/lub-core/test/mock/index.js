'use strict';

const mm = require('mm');
const lubNpm = require('lub-npm');
const inquire = require('inquirer');

mm(inquire, 'prompt', () => {
  return {
    init: true,
  };
});

mm(lubNpm, 'install', (pluginName, option) => {
  console.log(pluginName);
  console.log(option.registry);
  console.log(option.npmClient);
  return true;
});
