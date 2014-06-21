var app = require('express')()

app.use(require('body-parser').json())

require('ezseed-web')(app)
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


app.listen(require('./lib/config').port || 8970)

module.exports = app
