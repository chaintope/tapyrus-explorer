const log4js = require('log4js');

const LOG_LEVEL = process.env.TAPYRUS_EXPLORER_LOG_LEVEL || 'warn';
log4js.configure({
  appenders: {
    everything: { type: 'stdout' }
  },
  categories: {
    default: { appenders: ['everything'], level: LOG_LEVEL }
  }
});

const logger = log4js.getLogger();

module.exports = logger;
