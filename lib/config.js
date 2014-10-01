var logger = require('ezseed-logger')(), constants = require('../constants')

try {
  var config = require(constants.CONFIG_FILE)
} catch(e) {
  if(e.code === 'MODULE_NOT_FOUND') {
    logger.error('Configuration file not founded - did you ran "ezseed"?')
    process.exit(1)
  } else {
    logger.error('There is an error in your configuration file')

    throw e;
  }
}

module.exports = config
