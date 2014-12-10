var p = require('path')
  , helper = require('../helpers/promise')
  , scripts_path = p.resolve(__dirname, '../../scripts')
  , logger = require('ezseed-logger')('server')
  , os = require('os')

module.exports = {
  client: function(client) {
    return function() {
      return helper.runasroot(require('ezseed-'+client)('install'))
    }
  },
  server: function(host, base) {
    return function() {
      return helper.condition(os.platform() == 'linux', function() {
        return helper.runasroot(p.join(scripts_path, 'server.sh') + ' ' +host + ' ' + base)
      }, function() {
        logger.warn('System user not supported')
        return helper.next(0)
      })      
    }
  }
}
