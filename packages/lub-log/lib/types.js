'use strict';
const figures = require('figures');

module.exports = {
  log: {
    badge: '',
    color: '',
    label: '',
    logLevel: 'info',
  },
  info: {
    badge: figures.info,
    color: 'blue',
    label: 'info',
    logLevel: 'info',
  },
  warn: {
    badge: figures.warning,
    color: 'yellow',
    label: 'warning',
    logLevel: 'warn',
  },
  error: {
    badge: figures.cross,
    color: 'red',
    label: 'error',
    logLevel: 'error',
  },
  success: {
    badge: figures.tick,
    color: 'green',
    label: 'success',
    logLevel: 'info',
  },
  wait: {
    badge: figures.ellipsis,
    color: 'blue',
    label: 'waiting',
    logLevel: 'info',
  },
  complete: {
    badge: figures.checkboxOn,
    color: 'cyan',
    label: 'complete',
    logLevel: 'info',
  },
  start: {
    badge: figures.play,
    color: 'green',
    label: 'start',
    logLevel: 'info',
  },
  watch: {
    badge: figures.ellipsis,
    color: 'yellow',
    label: 'watching',
    logLevel: 'info',
  },
};
