var chalk = require('chalk'), 
	rainbow = require('ansi-rainbow')

var text = "                                                         _|\n"+
		   "   _|_|    _|_|_|_|    _|_|_|    _|_|      _|_|      _|_|_|\n"+
		   " _|_|_|_|      _|    _|_|      _|_|_|_|  _|_|_|_|  _|    _|\n"+
		   " _|          _|          _|_|  _|        _|        _|    _|\n"+
		   "   _|_|_|  _|_|_|_|  _|_|_|      _|_|_|    _|_|_|    _|_|_|\n"

module.exports.print = function() {
	var arr = text.split('\n')

	for(var i in arr) {
		console.log(rainbow.r(arr[i]))
	}

}

module.exports.text = text