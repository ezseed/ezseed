var spawner = require('../helpers/spawner')
  , helper = require('../helpers/promise')

module.exports = {
  client: function(client) {
    return function(opts) {
      helper.checkroot()
			return spawner.spawn(require('ezseed-'+client)('daemon') + ' ' + [opts.command, opts.user].join(' '))
    }
  },
  ezseed: function(command) {
    // body...
  }

}
