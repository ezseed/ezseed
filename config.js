var chalk = require('chalk')

try {
	var config = require('./config/config')
} catch(e) {
	if(e.code === 'MODULE_NOT_FOUND') {
		console.log(chalk.red('Configuration file not founded - did you ran "ezseed"?'))
		process.exit(1)
	} else {
		console.log(chalk.red('There is an error in your configuration file'))

		throw e;
	}
}

module.exports = config