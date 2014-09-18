var app = require('express')()
  , config = require('./lib/config')
  , logger = require('ezseed-logger')('ezseed')
  , debug = require('debug')('ezseed:server')

app.use(require('body-parser').json())
//logger
app.use(require('morgan')('dev'))

require(config.theme)(app)
require('./api')(app)


// app.listen(sock_path, function() {
// 	console.log('Server listening on %s', sock_path)
// })
//
// process.on('exit', function() {
// 	require('rimraf').sync(sock_path)
// })
//
// process.on('SIGINT', function() {
// 	require('rimraf').sync(sock_path)
//
// 	setTimeout(function() { process.exit(0) })
// })

var port = config.port || 8970

require('ezseed-database')(function() {
  app.listen(port, function() {
    require('ezseed-logger')('server').log('Listening on ' + port)
  })
})

var axon = require('axon')
  , sock = axon.socket('pull')
  , socket = config.watcher
  , rpc_socket = config.watcher_rpc
  , fs = require('fs')
  , rpc = require('pm2-axon-rpc')
  , req = axon.socket('req')
  , rep = axon.socket('rep')

process.watcher = {}
process.watcher.client = new rpc.Client(req)

try {
    debug('Watcher socket: %s', socket)

    sock.connect(socket)

    sock.on('connect', function() {
      //create a path to watch
      logger.log('Watcher sock %s connected', socket)

      req.connect(rpc_socket)

      // client.call('refresh', paths, function(err, n){
      //     console.log(n);
      // })

    })

    sock.on('message', function(msg, update){
      //notify client for update
    })
} catch(e) {
  logger.error('Watcher not found on port %s', socket)
  logger.error(e)
}

process.on('unhandledException', function(e) {
  console.log(e) 
})

module.exports = app
