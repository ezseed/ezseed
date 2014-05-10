var express = require('express');
var app = express();

var p = require('path');

var sock_path = p.join(__dirname, 'ezseed.sock')

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(sock_path, function() {
	console.log('Server listening on %s', sock_path)
});

process.on('exit', function() {
	require('rimraf').sync(sock_path)
})

process.on('SIGINT', function() {
	require('rimraf').sync(sock_path)
	
	setTimeout(function() { process.exit(0) })	
})