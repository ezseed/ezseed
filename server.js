var app = require('express')()
  , config = require('./lib/config')
  , logger = require('ezseed-logger')('ezseed')
  , debug = require('debug')('ezseed:server')

var port = config.port || 8970
var database = null
  
if(process.env.NODE_ENV == 'test') {
  port = 7103
  var database = 'ezseed-test'
}


//watcher socket variables
var axon = require('ezseed-axon')
  , sock = axon.socket('pull')
  , socket = config.watcher
  , rpc_socket = config.watcher_rpc
  , fs = require('fs')
  , rpc = require('pm2-axon-rpc')
  , req = axon.socket('req')
  , rep = axon.socket('rep')

//using process to store global variables
process.watcher = {}
process.watcher.client = new rpc.Client(req)

//body-parser
app.use(require('body-parser').json())
//logger
app.use(require('morgan')('dev'))

//loading the template
require(config.theme)(app)

//add tmp static dir (used for covers)
app.use('/tmp', require('express').static(config.tmp))

//loading api
require('./api')(app)

require('ezseed-database')({database: database || 'ezseed'}, function() {
  var server = app.listen(port, function() {
    require('ezseed-logger')('server').log('Listening on ' + port)
  })

  var io = require('socket.io')(server);

  //connect the watcher
  sock.connect(socket)

  sock.on('connect', function() {
    //create a path to watch
    logger.log('Watcher sock %s connected', socket)
    //connect the client
    req.connect(rpc_socket)
  })

  io.on('connection', function(socket) {
    sock.on('message', function(msg, update){
      //notify client for update
      logger.log('Watcher message', msg)
      socket.emit(msg, update)
    })
  })
})

process.on('unhandledException', function(e) {
  console.log(e) 
})

module.exports = app

//@todo listen on unix socket?
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
