var p = require('path')

var HOME = process.env.EZSEED_HOME || process.env.HOME

var DEFAULT_FILE_PATH = p.resolve(HOME, '.ezseed')

module.exports = {
  HOME: DEFAULT_FILE_PATH,
  CONFIG_FILE: p.join(DEFAULT_FILE_PATH, 'config.js'),
}
