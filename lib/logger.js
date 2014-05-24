var chalk = require('chalk')

var logger = {}
  , colors = {
			log: chalk.blue,
			info: chalk.black,
			warn: chalk.yellow,
			error: chalk.red
		}

;['log', 'info', 'warn', 'error'].forEach(function(method) {
		logger[method] = console[method].bind(console, colors[method](method) + ':')
})

module.exports = logger