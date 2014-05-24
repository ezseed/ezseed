/*
 * 1) config.js
 * 2) remplacer dans ezseed.json
 * 3) créer tmp
 * 4) installer client ? => ezseed install
 * 5) ajouter admin ?
 * 6) gulp + test + pm2 ??
 */

var p = require('path')
  , logger = require('../lib/logger')
  , fs = require('fs')
  , i18n = require('i18n')
  , config = require('../config/config-sample')
  , config_path = p.join(p.resolve(__dirname, '../config'), 'config.js')

if(process.getuid() !== 0) {
	logger.error('Sorry but this needs to be run as root. Exiting.')
		process.exit(1)
}

require('./helpers/ascii').print()

require('./inquirer/config')
.then(function(answers) {

	for(var answer in answers) {
		config[answer] = answers[answer]
	}

	logger.info('Installing server...')
	return require('./commands/install').server('localhost:'+answers.port)
})
.catch(function(code) {
	logger.error('server.sh bad exit code', code)
})
.then(function() {
	return require('./inquirer/client')
})
.then(function(client) {
	return require('./commands/install').client(client)
})
.then(function() {

	if(fs.existsSync(config_path)) {
		logger.error(i18n.__('%s already exists', config_path))
	} else {
		fs.writeFileSync(config_path, 'module.exports = '+JSON.stringify(config))
		logger.info(i18n.__('Configuration saved in %s', config_path))
	}
	console.log('test')

})