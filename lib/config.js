var logger = require('ezseed-logger')()

try {
  var config = require('/usr/local/opt/ezseed/config.js')
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
