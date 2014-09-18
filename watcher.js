var config = require('./lib/config')

config.socket = config.watcher
config.rpc_socket = config.watcher_rpc

require('ezseed-watcher')(config, function(err, watcher) {
  if(err) throw err
})
